import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'sliceTextAddPeriods',
    standalone: true,
})
export class SliceTextWithPeriods implements PipeTransform {
    transform(value: string, maxLength: number) {
        if (value.length > maxLength) {
            return value.slice(0, maxLength) + '...'
        }
        return value;
    }
}