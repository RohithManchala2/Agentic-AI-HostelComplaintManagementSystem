from services.groq_service import llm

from prompts.rag_response_prompt import RAG_RESPONSE_PROMPT
from tools.rag_tools import retrieve_documents


async def rag_response_node(state):
    """
    Retrieve relevant handbook content and generate
    a natural language response.
    """

    rag_query = state["rag_query"]
    question = rag_query["question"]

    try:
        # Retrieve relevant documents
        documents = retrieve_documents(question)

        if not documents:
            answer = (
                "I couldn't find any information related to your question "
                "in the hostel handbook. Please try rephrasing your question."
            )

        else:
            context = "\n\n".join(
                doc.page_content for doc in documents
            )

            messages = [
                ("system", RAG_RESPONSE_PROMPT),
                (
                    "human",
                    f"""
                    Context:
                    {context}

                    Question:
                    {question}
                              """
                ),
            ]

            response = llm.invoke(messages)
            answer = response.content

    except Exception as exc:
        answer = (
            f"Sorry, I couldn't retrieve the requested information. ({exc})"
        )

    return {
        **state,
        "response": {
            "type": "rag",
            "answer": answer,
        },
    }