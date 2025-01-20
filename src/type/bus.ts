export interface Bus {
    id: number;
    device_id: number;
    car_type_id: number;
    car_status_id: number;
    plate_no: string;
    internal_bus: boolean;
    fixed_bus: boolean;
    year: string;
    model: string;
    brand: string;
    image_path: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}