import os

for key, value in os.environ.items():
    try:
        value.encode('utf-8')
    except UnicodeEncodeError:
        print(f"⚠️ {key} = {repr(value)}")
