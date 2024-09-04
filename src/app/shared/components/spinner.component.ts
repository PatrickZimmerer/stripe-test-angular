import { Component, inject } from "@angular/core";
import { SpinnerService } from "@shared/services/spinner.service";

@Component({
  selector: "app-spinner",
  standalone: true,
  imports: [],
  template: ` @if (isLoading()) {
    <div class="overlay">
      <div class="flex justify-center items-center min-h-screen">
        <div
          class="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-600"
        ></div>
      </div>
    </div>
  }`,
})
export default class SpinnerComponent {
  private readonly spinnerService = inject(SpinnerService);
  isLoading = this.spinnerService.isLoading;
}
