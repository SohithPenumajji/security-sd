import sqlite3

def create_db():
    conn = sqlite3.connect('users.db')  # Connect to the database (it will create if it doesn't exist)
    cursor = conn.cursor()

    # Create the users table if it doesn't exist
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY,
                        username TEXT NOT NULL,
                        password TEXT NOT NULL
                    )''')
    
    # Insert users with complex passwords if they don't already exist
    cursor.execute("INSERT INTO users (username, password) VALUES ('sam', 'S@m#2024!Pass')")
    cursor.execute("INSERT INTO users (username, password) VALUES ('doe', 'D0e$Secure@!23')")
    cursor.execute("INSERT INTO users (username, password) VALUES ('john', 'J0hn@2024@#Pass!')")
    cursor.execute("INSERT INTO users (username, password) VALUES ('alice', 'Alic3#2024!Pwd')")
    cursor.execute("INSERT INTO users (username, password) VALUES ('bob', 'B0b$2024@#Password')")
    cursor.execute("INSERT INTO users (username, password) VALUES ('charlie', 'Ch@rlie$Pass!2024')")
    
    conn.commit()
    conn.close()

# Call this function to create the database
create_db()
