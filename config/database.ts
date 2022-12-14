import SyrveApi from "../modules/SyrveApi";

const config: any = {
    streets: { load: () => loadStreets(), data: null },
    nomenclature: { load: () => SyrveApi.nomenclature(), data: null }
}

export const database = {
    loadAll: async () => {
        for (const [key, value] of Object.entries(config)) {
            const { load }: any = value;

            config[key].data = await load();
        }
    },
    get: (param: string) => config[param].data
}

async function loadStreets() {
    const RU = await SyrveApi.street('RU');
    const UA = await SyrveApi.street('UA');

    return [...RU, ...UA].reduce((streets, row) => {
        streets[row.name] = row.id;

        return streets;
    }, {})
}