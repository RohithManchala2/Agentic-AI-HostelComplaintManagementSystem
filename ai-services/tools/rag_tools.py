from pathlib import Path

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings


BASE_DIR = Path(__file__).resolve().parent.parent
VECTOR_DIR = BASE_DIR / "vectorstore"

# Load the same embedding model used during ingestion
try:
    embeddings = HuggingFaceEmbeddings(
        model_name="BAAI/bge-small-en-v1.5"
    )

    # Load FAISS index if it exists
    if VECTOR_DIR.exists():
        vectorstore = FAISS.load_local(
            str(VECTOR_DIR),
            embeddings,
            allow_dangerous_deserialization=True
        )

        # Create retriever
        retriever = vectorstore.as_retriever(
            search_type="mmr",
            search_kwargs={
                "k": 3,
                "fetch_k": 10
            }
        )
    else:
        retriever = None
except Exception:
    retriever = None


def retrieve_documents(question: str):
    """
    Retrieve the most relevant hostel handbook chunks.
    """

    if retriever is None:
        return []

    docs = retriever.invoke(question)

    return docs