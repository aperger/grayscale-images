import { EventEmitter, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GrayscaleImageServiceService {

    public readonly ERROR_URL = '#ERROR#';

    constructor(private sanitizer: DomSanitizer) { }

    getUrlOfImageFile(file: File): Observable<ArrayBuffer | string> {
        const emitter = new EventEmitter<ArrayBuffer | string | null>();

        const mimeType = file.type;
        if (mimeType.match(/image\/*/) == null) {
            setTimeout(() => emitter.emit(this.ERROR_URL), 20);
        } else {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (() => {
                const url: ArrayBuffer | string = reader.result;
                if (url && url.toString().startsWith('unsafe')) {
                    emitter.emit(this.ERROR_URL);
                } else {
                    emitter.emit(url);
                }
            });
        }
        return emitter;
    }

    grayscale(sourceImage: HTMLImageElement, targetCanvas: HTMLCanvasElement) {
        const imgWidth = sourceImage.width;
        const imgHeight = sourceImage.height;

        targetCanvas.width = imgWidth;
        targetCanvas.height = imgHeight;
        const cx = targetCanvas.getContext('2d');

        cx.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height);

        const imageData = cx.getImageData(0, 0, imgWidth, imgHeight);
        // This loop gets every pixels on the image and
        for (let i = 0; i < imageData.height; i++) {
            for (let j = 0; j < imageData.width; j++) {
                const index = (i * 4) * imageData.width + (j * 4);
                const red = imageData.data[index];
                const green = imageData.data[index + 1];
                const blue = imageData.data[index + 2];
                const alpha = imageData.data[index + 3];
                const average = (red + green + blue) / 3;
                imageData.data[index] = average;
                imageData.data[index + 1] = average;
                imageData.data[index + 2] = average;
                imageData.data[index + 3] = alpha;
            }
        }
        cx.clearRect(0, 0, imgWidth, imgHeight);
        cx.putImageData(imageData, 0, 0, 0, 0, imgWidth, imgHeight);

        return;
    }

    download(canvasEl: HTMLCanvasElement, fileName: string): void {
        const link = document.createElement('a');
        link.href = canvasEl.toDataURL();
        link.download = fileName;
        link.click();
    }
}
