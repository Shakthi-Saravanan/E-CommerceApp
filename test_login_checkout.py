from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import TimeoutException, UnexpectedAlertPresentException
import json
import time
import datetime
import os


def write_html_report(username, matched, alerts, final_url):
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    status = "✅ Passed" if matched else "❌ Failed"
    alert_summary = ", ".join(alerts) if alerts else "None"

    report_file = "login_test_report.html"
    row_html = f"""
        <tr>
            <td>{timestamp}</td>
            <td>{username}</td>
            <td>{status}</td>
            <td>{alert_summary}</td>
            <td>{final_url}</td>
        </tr>
    """

    if not os.path.exists(report_file):
        with open(report_file, "w", encoding="utf-8") as f:
            f.write(f"""
                <html>
                <head>
                    <title>Login Test Report</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; padding: 20px; }}
                        table {{ border-collapse: collapse; width: 100%; }}
                        th, td {{ border: 1px solid #ccc; padding: 8px; text-align: left; }}
                        th {{ background-color: #f2f2f2; }}
                    </style>
                </head>
                <body>
                    <h2>🧪 Selenium Login Test Log</h2>
                    <table>
                        <tr>
                            <th>Timestamp</th>
                            <th>Username</th>
                            <th>Status</th>
                            <th>Alerts</th>
                            <th>Redirected URL</th>
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

    print("📄 Report updated: login_test_report.html")


def test_manual_login():
    with open('ecommerce-backend\\users.json') as f:
        users = json.load(f)

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    driver.get("http://localhost:3000")
    wait = WebDriverWait(driver, 60)

    print("Please click the Login link...")
    wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Login"))).click()

    username_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Username']")))
    password_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Password']")))
    wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Login']")))

    print("Please manually enter credentials and click 'Login'...")

    username_value = ""
    password_value = ""

    # Wait until redirected or alert appears
    while True:
        try:
            username_value = username_input.get_attribute("value")
            password_value = password_input.get_attribute("value")
        except UnexpectedAlertPresentException:
            continue

        try:
            WebDriverWait(driver, 1).until(EC.alert_is_present())
            break
        except TimeoutException:
            pass

        current_url = driver.current_url
        if username_value and password_value and ("checkout" in current_url or "dashboard" in current_url):
            break
        time.sleep(0.5)

    # Collect ALL alerts
    alert_texts = []
    alert_count = 0
    max_alerts = 5
    while alert_count < max_alerts:
        try:
            alert = WebDriverWait(driver, 2).until(EC.alert_is_present())
            alert_text = alert.text
            print(f"🔔 Alert {alert_count + 1}: {alert_text}")
            alert_texts.append(alert_text)
            alert.accept()
            alert_count += 1
            time.sleep(0.5)
        except TimeoutException:
            break

    # Match entered credentials
    matched = any(user['username'] == username_value and user['password'] == password_value for user in users)

    # Report generation
    write_html_report(username_value, matched, alert_texts, driver.current_url)

    driver.quit()

    # Final assertion
    assert matched, f"Login failed: '{username_value}' not found in users.json"
    print(f"✅ Login test passed for: {username_value}")
