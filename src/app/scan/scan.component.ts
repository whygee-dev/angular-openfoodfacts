import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { QuaggaJSResultObject } from '@ericblade/quagga2';
import {
  BarcodeScannerLivestreamComponent,
  BarcodeScannerLivestreamModule,
} from 'ngx-barcode-scanner';
import { ApiService } from '../api.service';
import { firstValueFrom } from 'rxjs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { barcodeValidator } from '../validators/barcode.validator';

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [BarcodeScannerLivestreamModule, ReactiveFormsModule],
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.scss',
})
export class ScanComponent {
  constructor(
    private readonly router: Router,
    private readonly apiService: ApiService
  ) {}

  barcodeControl = new FormControl('', [barcodeValidator()]);

  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner!: BarcodeScannerLivestreamComponent;

  async onChange(result: QuaggaJSResultObject) {
    if (!result.codeResult.code) {
      return;
    }

    try {
      if (
        !(await firstValueFrom(
          this.apiService.getProduct(result.codeResult.code)
        ))
      ) {
        return;
      }
      this.router.navigate(['/product', result.codeResult.code]);
    } catch (error) {}
  }

  async onSubmit() {
    if (!this.barcodeControl.value || this.barcodeControl.invalid) {
      return;
    }

    try {
      if (
        !(await firstValueFrom(
          this.apiService.getProduct(this.barcodeControl.value)
        ))
      ) {
        return;
      }
      this.router.navigate(['/product', this.barcodeControl.value]);
    } catch (error) {}
  }

  ngAfterViewInit() {
    this.barcodeScanner.start();
  }
}
