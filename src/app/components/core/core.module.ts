import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./header/header.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [HeaderComponent],
    providers: [],
    imports: [CommonModule, RouterModule, SharedModule],
    exports: [HeaderComponent]
})
export class CoreModule { }