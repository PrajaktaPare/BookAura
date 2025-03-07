from flask import request, jsonify, Blueprint,send_from_directory
from models.books import BooksModel
import os
from werkzeug.utils import secure_filename
from utils.auth_utils import decode_token

app = Blueprint('books', __name__)
books_model = BooksModel()

UPLOAD_FOLDER = 'uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def upload_file(file):
    """Save the uploaded file and return its path."""
    if not file:
        return None
    
    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    return file_path  

@app.route('/', methods=['GET'])
def get_all_books():
    rows = books_model.fetch_all_books()
    
    books = [{'book_id': row[0], 'author_id': row[1], 'title': row[2], 'description': row[3],'uploaded_by_role':row[8]} for row in rows]
    return jsonify(books)

@app.route('/<int:book_id>', methods=['GET'])
def get_book(book_id):
    row = books_model.fetch_book_by_id(book_id)
    if row is None:
        return jsonify({'error': 'Book not found'}), 404

    book = {
        'book_id': row[0],
        'author_id': row[1],
        'title': row[2],
        'description': row[3],
        'file_url': row[4],
        'is_public': row[5],
        'is_approved': row[6],
        'uploaded_at': row[7],
        'uploaded_by_role': row[8],
        'categories': row[9].split(', ') if row[9] else []  # Convert string to list
    }

    return jsonify(book)


@app.route('/', methods=['POST'])
def create_book():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    file_url = upload_file(file)  

    data = request.form  
    
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Authorization token is required'}), 401
    
    decoded_token = decode_token(token)
    if not decoded_token:
        return jsonify({'error': 'Invalid token'}), 401
    try:
        required_fields = ['title', 'description', 'is_public']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
    except e:
        return jsonify({'error': 'Missing required fields'}), 400
        

        
    
    
    
    
    is_public = data['is_public'].lower() == 'true' 


    uploaded_by_role = data['uploaded_by_role']

    # Insert into the database
    books_model.create_book(
        user_id=int(decoded_token['user_id']),
        title=data['title'],
        description=data['description'],
        file_url=file_url,  
        is_public=is_public,
        is_approved="0",
        uploaded_by_role=uploaded_by_role,
        category_ids=data['category_ids']
    )

    return jsonify({'message': 'Book created successfully', 'file_url': file_url}), 201

@app.route('/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    data = request.get_json()
    
    if books_model.fetch_book_by_id(book_id) is None:
        return jsonify({'error': 'Book not found'}), 404
    books_model.update_book(book_id, data['title'], data['description'], data['content'], data['is_public'], data['is_approved'])
    return jsonify({'message': 'Book updated successfully'})

@app.route('/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    if books_model.fetch_book_by_id(book_id) is None:
        return jsonify({'error': 'Book not found'}), 404
    books_model.delete_book(book_id)
    return jsonify({'message': 'Book deleted successfully'}), 200

@app.route('/unread/user', methods=['GET'])
def get_unread_books_by_user():
    """Fetch unread books for the user based on user ID."""
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Authorization token is required'}), 401

    decoded_token = decode_token(token)
    if not decoded_token:
        return jsonify({'error': 'Invalid token'}), 401

    user_id = decoded_token['user_id']

    unread_books = books_model.fetch_unread_books_by_user(user_id)

    books = [{
        'book_id': row[0], 'author_id': row[1], 'title': row[2], 
        'description': row[3], 'uploaded_by_role': row[8]
    } for row in unread_books]

    return jsonify(books)


@app.route('/unread/category', methods=['GET'])
def get_unread_books_by_category():
    """Fetch unread books based on categories."""
    categories = request.args.get('categories')
    if not categories:
        return jsonify({'error': 'Categories are required'}), 400
    
    category_list = categories.split(',')  # Expecting comma-separated values

    unread_books = books_model.fetch_unread_books_by_category(category_list)

    books = [{
        'book_id': row[0], 'author_id': row[1], 'title': row[2], 
        'description': row[3], 'uploaded_by_role': row[8]
    } for row in unread_books]

    return jsonify(books)


@app.route('/related', methods=['GET'])
def get_unread_books_by_user_and_category():
    """Fetch unread books for the user based on user ID and categories."""
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Authorization token is required'}), 401

    decoded_token = decode_token(token)
    if not decoded_token:
        return jsonify({'error': 'Invalid token'}), 401

    user_id = decoded_token['user_id']
    categories = request.args.get('categories')
    
    if not categories:
        return jsonify({'error': 'Categories are required'}), 400
    # print(categories.split(','))
    category_list = categories.split(',')

    unread_books = books_model.fetch_unread_books_by_user_and_category(user_id, category_list)

    return jsonify(unread_books)


@app.route('/<filename>')
def get_pdf(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/unread', methods=['GET'])
def get_unread_books():
    """Fetch books that the user has not read yet."""
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Authorization token is required'}), 401

    decoded_token = decode_token(token)
    if not decoded_token:
        return jsonify({'error': 'Invalid token'}), 401

    user_id = decoded_token['user_id']

    unread_books = books_model.fetch_unread_books(user_id)

    books = [{
        'book_id': row[0], 'author_id': row[1], 'title': row[2], 
        'description': row[3], 'uploaded_by_role': row[8]
    } for row in unread_books]

    return jsonify(books)


@app.route('/<int:book_id>/author', methods=['GET']) 
def get_book_author(book_id):    
    author = books_model.fetch_book_author(book_id)
    if author is None:
        return jsonify({'error': 'Author not found'}), 404
    return jsonify({'author_name': author})


@app.route('/search/<string:query>', methods=['GET'])  
def search_books(query):
    """Search for books based on title and description."""
    rows = books_model.search_books(query)
    books = [{'book_id': row[0], 'author_id': row[1], 'title': row[2], 'description': row[3],'uploaded_by_role':row[8]} for row in rows]
    return jsonify(books)
    
@app.route('/category/<int:category_id>', methods=['GET'])
def get_books_by_category(category_id):
    rows = books_model.fetch_books_by_category(category_id)
    
    books = [{
        'book_id': row['book_id'],
        'author_id': row['author_id'],
        'author_name': row['author_name'], 
        'title': row['title'],
        'description': row['description'],
        'fileUrl': row['fileUrl'],  
        'uploaded_by_role': row['uploaded_by_role'],
        'categories': row['categories'].split(', ') if row['categories'] else []  # Handle categories correctly
    } for row in rows]

    return jsonify(books)
