import os
import logging
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import time
import shutil
import json

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Load environment variables
load_dotenv()

# Load API keys
groq_api_key = os.getenv('GROQ_API_KEY')
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

# Ensure Docs folder exists
os.makedirs("Docs", exist_ok=True)

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://csip-eu-pythonanywhere.netlify.app"]}})# Initialize LLM
llm = ChatGroq(groq_api_key=groq_api_key, model_name="Llama3-8b-8192")

# Initialize global state
vectors = None
embeddings = None

prompt = ChatPromptTemplate.from_template(
    """
    Answer the questions based on the provided context and chat history.
    Please provide the most accurate and concise response based on the question.
    
    Chat History:
    {chat_history}
    
    Context:
    {context}
    
    Question: {input}
    """
)

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, '__dict__'):
            return obj.__dict__
        return str(obj)

app.json_encoder = CustomJSONEncoder

# Function to process and embed documents
def vector_embedding():
    global vectors, embeddings
    try:
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        loader = PyPDFDirectoryLoader("./Docs")
        docs = loader.load()
        logging.info(f"Loaded {len(docs)} documents")
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=200)
        final_documents = text_splitter.split_documents(docs)
        logging.info(f"Split into {len(final_documents)} chunks")
        vectors = FAISS.from_documents(final_documents, embeddings)
        logging.info("Vector embedding completed successfully")
    except Exception as e:
        logging.error(f"Error in vector_embedding: {str(e)}")
        raise
@app.route('/chat', methods=['POST'])
def chat():
    global vectors
    try:
        data = request.json
        logging.debug(f"Received data: {data}")
        
        if not data:
            logging.error("No JSON data received")
            return jsonify({"error": "No JSON data received"}), 400
        
        user_question = data.get('question')
        if not user_question:
            logging.error("No question provided")
            return jsonify({"error": "No question provided"}), 400
        
        chat_history = data.get('chat_history', [])

        logging.debug(f"Vectors: {vectors}")
        if vectors is None:
            logging.error("Vectors is None. Please upload and process documents first.")
            return jsonify({"error": "Please upload and process documents first."}), 400

        document_chain = create_stuff_documents_chain(llm, prompt)
        retriever = vectors.as_retriever()
        retrieval_chain = create_retrieval_chain(retriever, document_chain)
        
        chat_history_text = "\n".join([f"Q: {q}\nA: {a}" for q, a in chat_history])
        
        start = time.process_time()
        response = retrieval_chain.invoke({
            'input': user_question,
            'chat_history': chat_history_text
        })
        process_time = time.process_time() - start

        # Ensure the response is JSON serializable
        serializable_response = {
            'answer': response.get('answer', ''),
            'context': str(response.get('context', '')),  # Convert context to string
            'response_time': process_time
        }

        return jsonify(serializable_response), 200
    
    except Exception as e:
        logging.error(f"Error in chat: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'files' not in request.files:
        return jsonify({"error": "No file part"}), 400
    files = request.files.getlist('files')
    uploaded_files = []
    for file in files:
        if file and file.filename.endswith('.pdf'):
            filename = os.path.join('Docs', file.filename)
            file.save(filename)
            uploaded_files.append(file.filename)
    if uploaded_files:
        vector_embedding()  # Re-process documents after upload
        return jsonify({"message": f"{len(uploaded_files)} file(s) uploaded and processed: {', '.join(uploaded_files)}"}), 200
    else:
        return jsonify({"error": "No valid PDF files were uploaded"}), 400

@app.route('/clear', methods=['POST'])
def clear_docs():
    global vectors
    try:
        shutil.rmtree("Docs")
        os.makedirs("Docs", exist_ok=True)
        vectors = None
        return jsonify({"message": "Uploaded documents cleared"}), 200
    except Exception as e:
        logging.error(f"Error in clear_docs: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)