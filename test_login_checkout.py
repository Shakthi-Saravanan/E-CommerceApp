import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import json
import time
from selenium.common.exceptions import TimeoutException, UnexpectedAlertPresentException

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
    while True:
        try:
            WebDriverWait(driver, 1).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            print(f"🔔 Alert: {alert.text}")
            alert.accept()
            break
        except TimeoutException:
            pass
        except UnexpectedAlertPresentException:
            pass

        try:
            username_value = username_input.get_attribute("value")
            password_value = password_input.get_attribute("value")
        except UnexpectedAlertPresentException:
            continue

        current_url = driver.current_url
        if username_value and password_value and ("checkout" in current_url or "dashboard" in current_url):
            break

        time.sleep(0.5)

    for i in range(4):
        try:
            alert = WebDriverWait(driver, 2).until(EC.alert_is_present())
            print(f"🔔 Alert {i + 2}: {alert.text}")
            alert.accept()
        except TimeoutException:
            break

    matched = any(user['username'] == username_value and user['password'] == password_value for user in users)

    driver.quit()

    assert matched, f"Login failed: '{username_value}' not found in users.json"
    print(f"Login test passed for: {username_value}")
