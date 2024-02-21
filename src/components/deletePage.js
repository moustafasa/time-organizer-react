import { apiSlice } from "../features/api/apiSlice";

export const action =
  (dispatch) =>
  async ({ request, params }) => {
    const formData = await request.formData();
    const ids = formData.get("ids")?.split(",");
    const { page } = params;

    const deleteEndPoint =
      page === "rTasks" ? "deleteMultiRunTasks" : "deleteElement";

    try {
      const res = await dispatch(
        apiSlice.endpoints[deleteEndPoint].initiate(
          page === "rTasks" ? ids : { ids, page },
          {
            track: false,
          }
        )
      ).unwrap();
      console.log(res);
    } catch (err) {
      console.log(err);
    }

    return null;
  };
