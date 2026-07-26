from pathlib import Path
import pickle

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS


BASE_DIR = Path(__file__).resolve().parent

DATA_DIR = BASE_DIR / "data"
VECTOR_DIR = BASE_DIR / "vectorstore"

PDF_PATH = DATA_DIR / "hostel_handbook.pdf"


def build_vector_store():

    loader = PyPDFLoader(str(PDF_PATH))
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )

    chunks = splitter.split_documents(documents)

    embeddings = HuggingFaceEmbeddings(
        model_name="BAAI/bge-small-en-v1.5"
    )

    vectorstore = FAISS.from_documents(
        chunks,
        embeddings,
    )

    VECTOR_DIR.mkdir(exist_ok=True)

    vectorstore.save_local(str(VECTOR_DIR))

    with open(VECTOR_DIR / "hostel_docs.pkl", "wb") as file:
        pickle.dump(chunks, file)


if __name__ == "__main__":
    build_vector_store()