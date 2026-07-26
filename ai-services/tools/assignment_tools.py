import httpx

from config.settings import settings


async def handle_assignment(
    assignment_query: dict,
    cookies=None,
):
    """
    Handles assignment related requests.

    Supports

    1. Student
       - View assigned technician

    2. Warden
       - Assign technician
    """

    action = assignment_query["action"]

    async with httpx.AsyncClient() as client:

        # --------------------------------------------------
        # Student : View Assigned Technician
        # --------------------------------------------------

        if action == "view":

            response = await client.get(
                f"{settings.BACKEND_URL}/api/complaint/my",
                cookies=cookies,
            )

            response.raise_for_status()

            result = response.json()

            if not result.get("success"):
                raise Exception(
                    result.get("message", "Failed to fetch complaints.")
                )

            complaints = result.get("complaints", [])

            keyword = assignment_query.get("complaint_keyword")

            if keyword:
                keyword = keyword.lower()

                complaints = [
                    complaint
                    for complaint in complaints
                    if keyword in complaint["title"].lower()
                    or keyword in complaint["description"].lower()
                ]

            if len(complaints) == 0:
                return {
                    "success": False,
                    "message": "Complaint not found.",
                }

            if len(complaints) > 1:
                return {
                    "success": False,
                    "message": "Multiple complaints matched.",
                    "matches": complaints,
                }

            complaint = complaints[0]

            technician = complaint.get("assignedTo")

            if technician is None:
                return {
                    "success": True,
                    "assigned": False,
                    "message": "No technician has been assigned yet.",
                }

            return {
                "success": True,
                "assigned": True,
                "complaint": complaint,
                "technician": technician,
            }

        # --------------------------------------------------
        # Warden : Assign Technician
        # --------------------------------------------------

        if action == "assign":

            complaint_response = await client.get(
                f"{settings.BACKEND_URL}/api/complaint/all",
                cookies=cookies,
            )

            complaint_response.raise_for_status()

            complaint_result = complaint_response.json()

            if not complaint_result.get("success"):
                raise Exception(
                    complaint_result.get("message", "Failed to fetch complaints.")
                )

            complaints = complaint_result.get("complaints", [])

            technician_response = await client.get(
                f"{settings.BACKEND_URL}/api/user/technicians",
                cookies=cookies,
            )

            technician_response.raise_for_status()

            technician_result = technician_response.json()

            if not technician_result.get("success"):
                raise Exception(
                    technician_result.get("message", "Failed to fetch technicians.")
                )

            technicians = technician_result.get("data", [])

            keyword = (
                assignment_query.get("complaint_keyword") or ""
            ).lower()

            technician_name = (
                assignment_query.get("technician_name") or ""
            ).lower()

            complaint_matches = [
                complaint
                for complaint in complaints
                if keyword in complaint["title"].lower()
                or keyword in complaint["description"].lower()
            ]

            if len(complaint_matches) == 0:
                return {
                    "success": False,
                    "message": "Complaint not found.",
                }

            if len(complaint_matches) > 1:
                return {
                    "success": False,
                    "message": "Multiple complaints matched.",
                    "matches": complaint_matches,
                }

            technician_matches = [
                technician
                for technician in technicians
                if technician_name in technician["name"].lower()
            ]

            if len(technician_matches) == 0:
                return {
                    "success": False,
                    "message": "Technician not found.",
                }

            if len(technician_matches) > 1:
                return {
                    "success": False,
                    "message": "Multiple technicians matched.",
                    "matches": technician_matches,
                }

            complaint = complaint_matches[0]
            technician = technician_matches[0]

            if not technician["availability"]:
                return {
                    "success": False,
                    "message": f'{technician["name"]} is currently unavailable.',
                }

            assign_response = await client.put(
                f"{settings.BACKEND_URL}/api/complaint/assign/{complaint['_id']}",
                json={
                    "technicianId": technician["_id"],
                },
                cookies=cookies,
            )

            assign_response.raise_for_status()

            return assign_response.json()

    return {
        "success": False,
        "message": "Invalid assignment action.",
    }