from app import create_app

app = create_app() 

if __name__ == '__main__':
    print("Loading dataset...")
    app.run(debug=True, port=5001)  # Port buat image


# mau di tes pake postman 