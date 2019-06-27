
export class StatusModifierService {
    getText(originStatus: string) {
        switch (originStatus) {
            case 'inprocess':
                return 'COOKING'
                break;
            case 'ready':
                return 'PICK UP'
                break;
            case 'closed':
                return 'DONE'
                break;
            case 'cancelled':
                return 'CANCELLED'
                break;
            case 'confirmed':
                return 'CONFIRMED'
                break;
        }
    }

    getColor(originStatus: string) {
        switch (originStatus) {
            case 'inprocess':
                return '#4a90e2'
                break;
            case 'ready':
                return '#4a90e2'
                break;
            case 'closed':
                return '#5bba5c'
                break;
            case 'cancelled':
                return '#db1d3c'
                break;
            case 'confirmed':
                return '#000000'
                break;
        }
    }
}