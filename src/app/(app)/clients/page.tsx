import { getClientPageData } from "@/server/clients/queries";
import ClientPageController from "./ClientPageController";

export default async function ClientsPage() {
    const clientPageData = await getClientPageData();

    return (
        <ClientPageController
            clientTableData={clientPageData.tableData}
            isGuest={clientPageData.isGuest}
        />
    );
}
