import { Component ,AfterViewInit,OnInit} from '@angular/core';
import {Router} from '@angular/router'
import { OAOService } from "../../../services/OAO.Service";
declare var jQuery:any;
@Component({
    selector: 'oao-header',
    templateUrl: './oaoHeader.component.html'
    
})
export class oaoHeaderComponent{
	private logoName:String;
	constructor(private oaoService: OAOService){
		this.oaoService.getLOGO().subscribe((data)=>{
			console.log(data);
			this.logoName=data.logoName;
		},(error)=>{
			console.log(error);
		},()=>{
			console.log("success");
		})
	}
    clear(){
        window.location.href=this.oaoService.baseURL;
        localStorage.clear();
    }
}