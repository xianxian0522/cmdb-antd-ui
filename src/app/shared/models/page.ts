export interface Page<MODEL> {
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
    numberOfElements: number;
    content?: MODEL[];
}
