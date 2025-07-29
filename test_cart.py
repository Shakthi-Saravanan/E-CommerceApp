from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, UnexpectedAlertPresentException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
import datetime
import os
import time

def write_html_report(action, status, alerts, final_url):
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    status_symbol = "✅ Passed" if status else "❌ Failed"
    alert_summary = ", ".join(alerts) if alerts else "None"
    report_file = "cart_test_report.html"

    row_html = f"""
        <tr>
            <td>{timestamp}</td>
            <td>{action}</td>
            <td>{status_symbol}</td>
            <td>{alert_summary}</td>
            <td>{final_url}</td>
        </tr>
    """

    if not os.path.exists(report_file):
        with open(report_file, "w", encoding="utf-8") as f:
            f.write(f"""
                <html>
                <head>
                    <title>Cart Test Report</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; padding: 20px; }}
                        table {{ border-collapse: collapse; width: 100%; }}
                        th, td {{ border: 1px solid #ccc; padding: 8px; text-align: left; }}
                        th {{ background-color: #f2f2f2; }}
                    </style>
                </head>
                <body>
                    <h2>🛒 Selenium Cart Test Log</h2>
                    <table>
                        <tr>
                            <th>Timestamp</th>
                            <th>Action</th>
                            <th>Status</th>
                            <th>Alerts</th>
                            <th>Final URL</th>
                        </tr>
                        {row_html}
                    </table>
                </body>
                </html>
            """)
    else:
        with open(report_file, "r+", encoding="utf-8") as f:
            content = f.read()
            insert_at = content.rfind("</table>")
            if insert_at != -1:
                content = content[:insert_at] + row_html + content[insert_at:]
                f.seek(0)
                f.write(content)
                f.truncate()

    print("📄 Report updated: cart_test_report.html")


def test_cart_page():
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    driver.get("http://localhost:3000")
    wait = WebDriverWait(driver, 10)

    alert_texts = []
    try:
        # Add to cart
        add_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[contains(text(), "Add to Cart")]')))
        add_button.click()

        # Handle alert(s)
        alert_count = 0
        max_alerts = 3
        while alert_count < max_alerts:
            try:
                alert = WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert_texts.append(alert.text)
                print(f"🔔 Alert {alert_count + 1}: {alert.text}")
                alert.accept()
                alert_count += 1
                time.sleep(0.5)
            except TimeoutException:
                break

        # Go to Cart
        cart_link = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Cart")))
        cart_link.click()
        time.sleep(2)

        # Remove from cart
        try:
            remove_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[contains(text(), "Remove")]')))
            remove_button.click()

            # Optional alert after removal
            try:
                alert = WebDriverWait(driver, 2).until(EC.alert_is_present())
                alert_texts.append(alert.text)
                print("🔔 Alert:", alert.text)
                alert.accept()
            except TimeoutException:
                pass

            test_status = True
        except NoSuchElementException:
            test_status = False
    except Exception as e:
        print("🚨 Test failed due to exception:", str(e))
        test_status = False

    final_url = driver.current_url
    write_html_report("Cart Add + Remove", test_status, alert_texts, final_url)
    driver.quit()

    assert test_status, "❌ Cart test failed!"

# Run test directly
if __name__ == "__main__":
    test_cart_page()
