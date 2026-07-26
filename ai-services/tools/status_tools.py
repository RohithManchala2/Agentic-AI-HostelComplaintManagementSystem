import httpx

from config.settings import settings


async def get_complaint_status(status_query: dict, cookies=None):
    """
    Fetch student's complaints from the backend and
    filter them according to the status query.
    """

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.BACKEND_URL}/api/complaint/my",
            cookies=cookies,
        )

    response.raise_for_status()

    result = response.json()

    if not result.get("success"):
        raise Exception(result.get("message", "Failed to fetch complaints"))

    complaints = result.get("complaints", [])

    query_type = status_query["query_type"]
    keyword = status_query.get("keyword")

    if query_type == "all":
        return complaints

    if query_type == "latest":
        return complaints[:1]

    if query_type == "pending":
        return [
            complaint
            for complaint in complaints
            if complaint["status"] == "Pending"
        ]

    if query_type == "resolved":
        return [
            complaint
            for complaint in complaints
            if complaint["status"] == "Resolved"
        ]

    if query_type == "in_progress":
        return [
            complaint
            for complaint in complaints
            if complaint["status"] == "In Progress"
        ]

    if query_type == "specific":
        keyword = keyword.lower()

        return [
            complaint
            for complaint in complaints
            if keyword in complaint["title"].lower()
            or keyword in complaint["description"].lower()
        ]

    return []