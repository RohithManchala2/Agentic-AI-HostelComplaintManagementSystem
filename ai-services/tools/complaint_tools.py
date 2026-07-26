import httpx

from config.settings import settings


async def create_complaint(
    complaint_data: dict,
    cookies: dict | None = None,
):
    """
    Calls the existing Hostel Complaint backend API
    to create a complaint.

    Parameters
    ----------
    complaint_data : dict
        {
            "title": "...",
            "description": "...",
            "category": "Electrical"
        }

    cookies : dict
        Authentication cookies forwarded from React.

    Returns
    -------
    dict
        Backend response.
    """

    url = f"{settings.BACKEND_URL}/api/complaint/create"

    async with httpx.AsyncClient(timeout=30.0) as client:

        response = await client.post(
            url,
            json=complaint_data,
            cookies=cookies,
        )

    response.raise_for_status()

    return response.json()