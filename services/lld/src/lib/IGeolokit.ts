export interface IPoiInput {
    pk_id?: number
    name?: string,
    type: string,
    typeId: number,
    references?: any[],
    fields: Ifields[]
}

export interface Ifields {
    type: string,
    title: string,
    content: unknown
    pk_id?: number | string | null
}

export interface IMediaInput {
    pk_id: number | null,
    name: string,
    extension: string,
    content: string,
    mime: string,
    accessibility: string,
    date: string,
    user_firstname: string,
    user_lastname: string,
}
