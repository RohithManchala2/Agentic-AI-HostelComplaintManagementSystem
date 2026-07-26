from pathlib import Path

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

BASE_DIR = Path(__file__).resolve().parent.parent
VECTOR_DIR = BASE_DIR / "vectorstore"

embeddings = None
vectorstore = None
retriever = None


def get_retriever():
    global embeddings, vectorstore, retriever

    if retriever is not None:
        return retriever

    try:
        embeddings = HuggingFaceEmbeddings(
            model_name="BAAI/bge-small-en-v1.5"
        )

        if VECTOR_DIR.exists():
            vectorstore = FAISS.load_local(
                str(VECTOR_DIR),
                embeddings,
                allow_dangerous_deserialization=True
            )

            retriever = vectorstore.as_retriever(
                search_type="mmr",
                search_kwargs={
                    "k": 3,
                    "fetch_k": 10
                }
            )

    except Exception as e:
        print(f"Retriever initialization failed: {e}")
        retriever = None

    return retriever


def retrieve_documents(question: str):
    """
    Retrieve the most relevant hostel handbook chunks.
    """

    retriever = get_retriever()

    if retriever is None:
        return []

    return retriever.invoke(question)