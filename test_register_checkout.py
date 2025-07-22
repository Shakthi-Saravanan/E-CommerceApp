import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoAlertPresentException
import time
import random
import string

@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless=new')  
    driver = webdriver.Chrome(options=options)
    yield driver
    driver.quit()

def generate_random_user():
    username = 'user_' + ''.join(random.choices(string.ascii_letters, k=5))
    password = 'Test1234'
    return username, password

def test_register_only(driver):
    driver.get("http://localhost:3000/register")
    time.sleep(2)
    
    username, password = generate_random_user()
    
    driver.find_element(By.XPATH, '//input[@placeholder="Username"]').send_keys(username)
    driver.find_element(By.XPATH, '//input[@placeholder="Password"]').send_keys(password)
    driver.find_element(By.XPATH, '//button[contains(text(), "Register")]').click()
    time.sleep(2)
    try:
        alert = driver.switch_to.alert
        message = alert.text
        alert.accept()
        print(f"Registration test passed with message: '{message}'")
    except NoAlertPresentException:
        pytest.fail("No alert appeared after registration.")
