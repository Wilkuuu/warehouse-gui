namespace Interfaces {

    export interface DeviceInterface {
        idx: number;
        name: string;
        company: CompanyInterface;
        description?: string;
        status: StatusInterface;
        serialNumber: string;
        category?: { idx: number, name?: string, description?: string };
        dateIn?: any;
        history?: { idx: any, status: StatusInterface, device: DeviceInterface, dateChange: any }[];
        dateOut?: any;
        find?: boolean;
    }

    export interface CompanyInterface {
        idx: number;
        name: string;
        description?: string;
    }

    export interface StatusInterface {
        idx: number;
        name: string;
        description?: string;
    }
}
