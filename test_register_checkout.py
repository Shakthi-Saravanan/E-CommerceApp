import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoAlertPresentException
import time
import random
import string
import os
import datetime

test_results = []  # Global list to store results

@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(options=options)
    yield driver
    driver.quit()

def generate_random_user(valid_email=True):
    username = 'user_' + ''.join(random.choices(string.ascii_letters, k=5))
    password = 'Test1234'
    email = f"{username}@example.com" if valid_email else "invalid-email"
    return username, email, password

def fill_form(driver, username, email, password):
    driver.find_element(By.XPATH, '//input[@placeholder="Username"]').clear()
    driver.find_element(By.XPATH, '//input[@placeholder="Email"]').clear()
    driver.find_element(By.XPATH, '//input[@placeholder="Password"]').clear()

    driver.find_element(By.XPATH, '//input[@placeholder="Username"]').send_keys(username)
    driver.find_element(By.XPATH, '//input[@placeholder="Email"]').send_keys(email)
    driver.find_element(By.XPATH, '//input[@placeholder="Password"]').send_keys(password)

    driver.find_element(By.XPATH, '//button[contains(text(), "Register")]').click()
    time.sleep(2)

def get_alert_text(driver):
    try:
        alert = driver.switch_to.alert
        text = alert.text
        alert.accept()
        return text
    except NoAlertPresentException:
        return None

# TEST CASE 1: Valid registration
def test_valid_registration(driver):
    driver.get("http://localhost:3000/register")
    username, email, password = generate_random_user(valid_email=True)
    fill_form(driver, username, email, password)

    message = get_alert_text(driver)
    passed = message and "success" in message.lower()
    test_results.append(("Valid Registration", "Passed" if passed else "Failed", message or "No alert"))
    write_html_report_register(username, email, passed, message or "No alert", driver.current_url)

    if not passed:
        pytest.fail("Valid registration failed")


# TEST CASE 2: Invalid email
def test_invalid_email(driver):
    driver.get("http://localhost:3000/register")
    username, email, password = generate_random_user(valid_email=False)
    fill_form(driver, username, email, password)

    message = get_alert_text(driver)
    passed = message and "invalid email" in message.lower()
    test_results.append(("Invalid Email", "Passed" if passed else "Failed", message or "No alert"))
    write_html_report_register(username, email, passed, message or "No alert", driver.current_url)

    if not passed:
        pytest.fail("Invalid email test failed")


# TEST CASE 3: Empty fields
def test_empty_fields(driver):
    driver.get("http://localhost:3000/register")
    fill_form(driver, "", "", "")

    message = get_alert_text(driver)
    passed = message and "all fields are required" in message.lower()
    test_results.append(("Empty Fields", "Passed" if passed else "Failed", message or "No alert"))
    write_html_report_register("N/A", "N/A", passed, message or "No alert", driver.current_url)

    if not passed:
        pytest.fail("Empty field test failed")

# HOOK: After all tests
def write_html_report_register(username, email, status, message, current_url):
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    display_status = "✅ Passed" if status else "❌ Failed"

    report_file = "register_test_report.html"
    row_html = f"""
        <tr>
            <td>{timestamp}</td>
            <td>{username}</td>
            <td>{email}</td>
            <td>{display_status}</td>
            <td>{message}</td>
            <td>{current_url}</td>
        </tr>
    """

    if not os.path.exists(report_file):
        with open(report_file, "w", encoding="utf-8") as f:
            f.write(f"""
                <html>
                <head>
                    <title>Registration Test Report</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; padding: 20px; }}
                        table {{ border-collapse: collapse; width: 100%; }}
                        th, td {{ border: 1px solid #ccc; padding: 8px; text-align: left; }}
                        th {{ background-color: #f2f2f2; }}
                    </style>
                </head>
                <body>
                    <h2>🧪 Selenium Registration Test Log</h2>
                    <table>
                        <tr>
                            <th>Timestamp</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Message</th>
                            <th>Current URL</th>
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

    print("📄 Report updated: register_test_report.html")
