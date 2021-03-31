import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { User } from './models/user';
import { CountryCodes } from './models/country-codes';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'msqcustomerreg';

  public user: User;
  isSubmitted = false;
  dataList: Array<CountryCodes> = [];
  selfie: any;
  idPic: any;
  picture: ""
  id_image: ""
  value = ''
  passwordMatch: Boolean = null;

  public type = 'password';
  public type1 = 'password';
  public showPass = false;
  public showPass1 = false;

  isLoading: boolean = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    // private toastController: ToastController,
    // private loadingController: LoadingController,
  ) {
  }
  async ngOnInit() {
    this.user = {
      name: "",
      address: '',
      code: "",
      phone: null,
      email: "",
      birth_date: null,
      password: "",
      confirm: "",
      picture: "",
      id_image: "",
      id_number: null,
      customerSituation: 'activate'
    };

    fetch('assets/country-code.json').then(async res => {
      let result = await res.json();
      this.dataList = result.data;

    })

  }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
  showPasswordConfirm() {
    this.showPass1 = !this.showPass1;
    if (this.showPass1) {
      this.type1 = 'text';
    } else {
      this.type1 = 'password';
    }
  }

  async register(form) {
    await this.present();
    // form.value.id_image = this.idPic.name;
    let formData = this.user;
    formData.id_image = this.user.id_image;
    formData.picture = this.user.picture;

    this.authService.register(formData).subscribe(async (response) => {
      if (response['status'] == 200) {
        let success = await response
        this.isSubmitted = true;
        this.dismiss(success['message'], 'success');
        // this.router.navigateByUrl("login");

        let id = response['user']['_id']
        this.authService.uploadImage(this.idPic, this.selfie, this.user.id_image, this.user.picture).subscribe(res => {
    
          this.isSubmitted = true;
          this.dismiss(success['message'], 'success');

        })
        Swal.fire({
          // position: 'top-end',
          icon: 'success',
          title: 'Please login your account to the application!',
          showConfirmButton: true,
          // timer: 1500
        })
      } else {
        Swal.fire({
          // position: 'top-end',
          icon: 'error',
          title: response['message'],
          showConfirmButton: true,
          // timer: 3000
        })
        this.dismiss(response['message'], 'danger')
      }
    }, async (error) => {

      let err = await error

      this.dismiss(err['message'], 'danger');
    });
  }

  async present() {
    this.isLoading = true;
  }

  async dismiss(message, type) {
    this.isLoading = false;
    // return await this.loadingController.dismiss().then(async () => {
    //   console.log('dismissed')
    //   await this.presentToast(message, type)
    // });
  }



  noSubmit(e) {
    e.preventDefault();
  }

  loadImageFromDevice(event, type) {
    if (event.target.files.length == 0) {
      return
    }
    let file = (event.target as HTMLInputElement).files[0];

    const reader = new FileReader();

    reader.onload = () => {

      let blob: Blob = new Blob([new Uint8Array((reader.result as ArrayBuffer))])

      let blobURL: string = URL.createObjectURL(blob)

      // console.log(blobURL);
      if (type == 'selfie') {
        this.selfie = file
        this.user.picture = this.selfie.name
      } else {
        this.idPic = file;
        this.user.id_image = this.idPic.name
      }


    };
    reader.onerror = error => {
      //handle errors
    };

    reader.readAsDataURL(file);

  }

  confirmPassword(event) {
    const password = this.user.password;
    // console.log(password);

    if (event.target.value == password) {
      this.passwordMatch = true;
    } else {
      this.passwordMatch = false;
    }
  }

  validatePassword(event) {
    const password = {
      length: 8,
      uppercase: /[A-Z]/g,
      lowercase: /[a-z]/g,
      number: /[0-9 ]/g
    }

    document.getElementById("message").style.display = "block";

    var letter = document.getElementById("letter");
    var capital = document.getElementById("capital");
    var number = document.getElementById("number");
    var length = document.getElementById("length");

    // Validate lowercase letters
    if (event.target.value.match(password.lowercase)) {
      letter.classList.remove("invalid");
      letter.classList.add("valid");
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
    }

    // Validate capital letters
    if (event.target.value.match(password.uppercase)) {
      capital.classList.remove("invalid");
      capital.classList.add("valid");
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }

    // Validate numbers
    if (event.target.value.match(password.number)) {
      number.classList.remove("invalid");
      number.classList.add("valid");
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }

    // Validate length
    if (event.target.value.length >= password.length) {
      length.classList.remove("invalid");
      length.classList.add("valid");
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
    }
  }

  onBlur(event) {
    document.getElementById("message").style.display = "none";
  }
}
