import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'image-grayscale';
    showImage = false;
    fileName: string = null;
    imgURL: ArrayBuffer | string = null;
    fileFormGroup: FormGroup = null;

    @ViewChild('fileInput')
    fileInputRef: ElementRef<HTMLInputElement>;

    @ViewChild('imgUploaded')
    imgUploadedRef: ElementRef<HTMLImageElement>;

    @ViewChild('canvasUploaded')
    canvasRef: ElementRef<HTMLCanvasElement>;

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        this.fileFormGroup = new FormGroup({});
    }


    fileBrowseHandler(fileList: FileList): void {
        console.log('fileBrowseHandler', fileList);
        if (fileList.length === 0) {
            return;
        }

        const file: File = fileList.item(0);

        const fileSize = file.size / 1024 / 1024; // in MiB
        if (fileSize > 5) {
            alert(`Hiba, a '${file.name}' fájl mérete túl nagy: ${fileSize.toFixed(2)} MiB! Maximum 5 MiB lehet!`);
            return;
        }

        this.preview(file);

    }

    preview(file: File): void {
        console.log('preview', file);
        this.showImage = false;

        const mimeType = file.type;
        if (mimeType.match(/image\/*/) == null) {
            alert('Only images are supported.');
            return;
        }


        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.imgURL = reader.result;
            this.showImage = true;
            this.fileName = file.name;
        };
    }

    clear(): void {
        this.imgURL = undefined;
        this.showImage = false;
        this.fileName = null;
    }

    download(): void {
        const canvasEl = this.canvasRef.nativeElement;

        const link = document.createElement('a');
        link.href = canvasEl.toDataURL(); //  this.imgURL.toString();
        link.download = 'gray_' + this.fileName;
        link.click();
    }

    grayscale(): void {
        const imageElement = this.imgUploadedRef.nativeElement;
        const imgWidth = imageElement.width;
        const imgHeight = imageElement.height;

        const canvasEl = this.canvasRef.nativeElement;
        canvasEl.width = imgWidth;
        canvasEl.height = imgHeight;
        const cx = canvasEl.getContext('2d');


        cx.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);

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
    }

}
