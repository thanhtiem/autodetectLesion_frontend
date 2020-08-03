import { ToastrService } from "ngx-toastr";
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CropperComponent, ImageCropperResult } from 'angular-cropperjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Cropper from 'cropperjs';
import { first } from 'rxjs/operators';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ImageCropperModule } from 'ngx-image-cropper';

@Component({
    selector: 'notifications-cmp',
    moduleId: module.id,
    styleUrls: ['notifications.component.scss'],
    templateUrl: 'notifications.component.html'
    
})

export class NotificationsComponent implements OnInit{
  @ViewChild('angularCropper', { static: false }) public angularCropper: CropperComponent;
  @ViewChild('image', { static: false }) image: ElementRef;
 

  activeColor: string = 'green';
  baseColor: string = '#ccc';
  overlayColor: string = 'rgba(255,255,255,0.5)';

 
  fileExtractTable: any;
  dragging: boolean = false;
  loaded: boolean = false;
  imageLoaded: boolean = false;
  imageSrc: any = '';
  url = '';
  ocrText = '';

  config: any;
  resultImage: any;
  resultResult: any = '';
  imageData: any[];
  item = 0;
  type = '';
  label = '';

  style = false;
  headerCopy = "";
  vuilongchonhinh = 'Vui lòng chọn hình';
  thongbao = "Thông báo";
  co = "Có";
  khong = "Không";
  vuilongchonhinhtothon = 'Vui lòng chọn hình có chất lượng tốt hơn';
  dulieudaduocsaochep = 'Dữ liệu đã được sao chép';

  constructor(private toastr: ToastrService) {
    this.config = {
      zoomable: true,
      scalable: true,
      multiaple: true
    }; 
  }
  ngOnInit(){
    var cropper;
    if (this.imageSrc != '') {
      cropper = new Cropper(this.image.nativeElement, {
        aspectRatio: 16 / 12,
      });
    }
    console.log('alo alo!!')
    console.log(this.imageSrc)
  }
  handleDragEnter() {
    this.dragging = true;
  }
  
  handleDragLeave() {
    this.dragging = false;
  }

  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
  }

  handleImageLoad() {
    this.imageLoaded = true;
    //this.iconColor = this.overlayColor;
  }

  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    console.log('file',file);
    if (file == undefined) {
      return;
    }
    this.type = file.type.replace('image/', '');
    console.log("type",this.type);
    if (this.type == 'pdf') {
      this.type = 'png';
    }
    this.resultResult = undefined;
    var pattern = /image-*/;


    if (!file.type.match(pattern)) {
      alert('invalid format');
      // return;
      // this.uploadPdf(e)
    } else {
      var reader = new FileReader();
      console.log('cc: ', reader);
      this.loaded = false;
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
      console.log('alo: ', this);
    }
  }

  handleReaderLoaded(e) {
    if (this.imageSrc != '')
      this.angularCropper.cropper.destroy();
    var reader = e.target;
    this.imageSrc = reader.result.slice(22, reader.result.length);
    // console.log('reader', reader);
    this.style = false;
    this.loaded = true;
    
  }

  cancel() {
    
  }
  CropMe() {
    this.angularCropper.exportCanvas();

  }

  resultImageFun(event: ImageCropperResult) {
    let urlCreator = window.URL;
    this.resultResult = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg');
    console.log('this.resultResult', this.resultResult);
  }

  checkstatus(event: any) {
    if (event.blob === undefined) {
      return;
    }
    let urlCreator = window.URL;
  }
  zoom(zoomIn: boolean) {
    let factor = zoomIn ? 0.1 : -0.1;
    this.angularCropper.cropper.zoom(factor);
    //("zoom");
  }
  ronate() {
    this.angularCropper.cropper.rotate(90);
  }
  next() {
    if (this.item === this.imageData.length - 1)
      this.item = 0;
    else this.item++;
    this.angularCropper.cropper.destroy();
    this.imageSrc = 'data:image/png;base64,' + this.imageData[this.item];
    console.log('this.imageSrc', this.imageSrc);
  }
  pre() {
    if (this.item === 0)
      this.item = this.imageData.length - 1;
    else this.item--;
    this.angularCropper.cropper.destroy();
    this.imageSrc = 'data:image/png;base64,' + this.imageData[this.item];
    console.log('this.imageSrc ', this.imageSrc );
  }
  public base64ToBlob(b64Data, contentType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8', sliceSize=1024) {
    b64Data = b64Data.slice(1, b64Data.length-1);
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
}
  showNotification(from, align) {
    const color = Math.floor(Math.random() * 5 + 1);

    switch (color) {
      case 1:
        this.toastr.info(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Welcome to <b>Detect Breast Cancer</b> - detect lesion using deep learning.</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-info alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 2:
        this.toastr.success(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Welcome to <b>Detect Breast Cancer</b> - detect lesion using deep learning.</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 3:
        this.toastr.warning(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Welcome to <b>Detect Breast Cancer</b> - detect lesion using deep learning.</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-warning alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 4:
        this.toastr.error(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Welcome to <b>Detect Breast Cancer</b> - detect lesion using deep learning.</span>',
          "",
          {
            timeOut: 4000,
            enableHtml: true,
            closeButton: true,
            toastClass: "alert alert-danger alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 5:
        this.toastr.show(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Welcome to <b>Detect Breast Cancer</b> - detect lesion using deep learning.</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-primary alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      default:
        break;
    }
  }
}
