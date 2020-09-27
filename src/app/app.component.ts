import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogHelper } from './dialog-helper';
import { GrayscaleImageServiceService } from './grayscale-image-service.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'Grayscale images';

    fileName: string = null;
    imgURL: ArrayBuffer | string = null;
    fileFormGroup: FormGroup = null;

    @ViewChild('fileInput')
    fileInputRef: ElementRef<HTMLInputElement>;

    @ViewChild('imgUploaded')
    imgUploadedRef: ElementRef<HTMLImageElement>;

    @ViewChild('canvasUploaded')
    canvasRef: ElementRef<HTMLCanvasElement>;

    public get showImage(): boolean {
        return !!this.imgURL;
    }

    constructor(
        public snackBar: MatSnackBar,
        private grayscaleService: GrayscaleImageServiceService) { }

    ngOnInit(): void {
        console.log('ngOnInit');
        this.fileFormGroup = new FormGroup({
            fileInput: new FormControl(null)
        });
    }


    fileBrowseHandler(fileList: FileList): void {
        console.log('fileBrowseHandler', fileList);
        if (fileList.length === 0) {
            return;
        }

        const file: File = fileList.item(0);

        const fileSize = file.size / 1024 / 1024; // in MiB
        if (fileSize > 5) {
            DialogHelper.showMessage(this.snackBar, `Error, file ('${file.name}') size is too big: ${fileSize.toFixed(2)} MiB, Maximum 5 MiB!`, true, DialogHelper.OK, 5000);
            return;
        }
        this.preview(file);
    }

    preview(file: File): void {
        console.log('preview', file);

        this.grayscaleService.getUrlOfImageFile(file).subscribe((url: ArrayBuffer | string) => {
            if (url === this.grayscaleService.ERROR_URL) {
                DialogHelper.showMessage(this.snackBar, 'Only images are supported.', true, DialogHelper.OK, 5000);
                this.clear();
                return;
            }
            this.imgURL = url;
            this.fileName = file.name;
        });
    }

    clear(): void {
        console.log('clear');
        this.imgURL = undefined;
        this.fileName = null;
        this.fileFormGroup.get('fileInput').setValue(null);
    }

    download(): void {
        console.log('download');
        this.grayscaleService.download(this.canvasRef.nativeElement, 'gray_' + this.fileName);
    }

    grayscale(): void {
        console.log('grayscale');
        this.grayscaleService.grayscale(this.imgUploadedRef.nativeElement, this.canvasRef.nativeElement);
    }

    onImgLoadingError(event: Event) {
        DialogHelper.showMessage(this.snackBar, 'Error at image loading: ' + this.fileName, true, DialogHelper.OK, 5000);
        this.clear();
    }

}
