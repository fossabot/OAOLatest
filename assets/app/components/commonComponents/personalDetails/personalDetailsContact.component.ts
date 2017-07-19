import { Component ,AfterViewInit,OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router'

import { google } from "../../../interfaces/configinterface";
import { ConfigDetails } from "../../../interfaces/configinterface";
import { OAOService } from "../../../services/OAO.Service"
import { FirstNameValidator } from "../../../validators/namevalidator"
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { Common } from '../../../validators/commonFunc';
import { DatePipe } from '@angular/common';
import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { CommonUtils } from '../../../validators/commonUtils';




declare var jQuery:any;
declare var Ladda
@Component({
    selector: 'personaldetailscontact',
    templateUrl: './personalDetailsContact.component.html'

})
export class PersonalDetailsContactComponent implements AfterViewInit,OnInit{
    public application_id:any;

    private check: boolean = false;//to display modal
    private hold: boolean = false;
    public state_drop: String[] = [];
    public street: String[] = [];
    public showAddress: String = "true"
    public showCustomAddr: String = "true"
    public showCustomPAddr: String = "true"
    public inf_001: String
    public wrn_001: String
    configMsg: ConfigDetails
    isLoading: boolean = false;
    public paddrShow: boolean = false;
    public addrErr = false;
    public paddrErr = false;
    public no_address_found_flag: string;

    public checkResult1: string;

    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    userExistingFlag: boolean; //chandan  //No changes in html page
    checkDupStatus: boolean = false; //chandan

    constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute) {
        this.model.postal_home_address_flag = false;
        console.log("PersonalDetailsContactComponent  constructor()")
        this.model = this.oaoService.getPersonalDetailsObject();
        if (this.model.postal_home_address_flag == undefined) {
            this.model.postal_home_address_flag = false;
        }
        if (this.model.postcode == undefined) {
            this.model.postcode = "1234";

        }
        if (this.model.ppostcode == undefined) {

            this.model.ppostcode = "1234";
        }
        if (this.model.address == undefined) {
            this.model.address = "";
        }
        if (this.model.paddress == undefined) {
            this.model.paddress = "";
        }
        if (this.model.state == undefined) {
            this.model.state = "";
        }
        if (this.model.streettype == undefined) {
            this.model.streettype = "";
        }
        if (this.model.pstate == undefined) {
            this.model.pstate = "";
        }
        if (this.model.pstreettype == undefined) {
            this.model.pstreettype = "";
        }
        console.log(this.oaoService.getPersonalDetailsObject())
        this.no_address_found_flag = "N";
        if (this.model.housenum != "" && this.model.housenum != "undefined" && this.model.housenum != null) {
            this.no_address_found_flag = "Y";
            this.showCustomAddr = "";
        }
        if (this.model.phousenum != "" && this.model.phousenum != "undefined" && this.model.phousenum != null) {
            this.paddrShow = true;
            this.showCustomPAddr = "";
        }
        this.userExistingFlag = this.oaoService.getUserExistingFlag(); //chandan
        this.oaoService.getConfig()
            .subscribe((data) => { this.configMsg = JSON.parse(JSON.stringify(data.data)); });


            }

        onSubmit(){
        
            CommonUtils.completedProgressBarStep(1);
                    console.log("onsubmit() personal details contact", this.model);
                    if(this.userExistingFlag){
                        console.log("existing user directly creating appliction")
                        this. submitSection();
                    }
                    else{
                        console.log("New  user ")
                        if(!this.oaoService.getCallMatchingCustomerFlag())
                        {
                            console.log("checkMatchingCustomer() called");
                            this.oaoService.checkMatchingCustomer(this.model)
                            .subscribe(data =>
                                {
                                    if(data.status){
                                        jQuery('#matching-customer-modal').modal('show');
                                     }
                                     else{
                                        this.oaoService.setCallMatchingCustomerFlag(true);
                                        this. submitSection();
                                    }
                                });    
                        }
                        else{
                            console.log("checkMatchingCustomer() not called");
                            this. submitSection();
                        }
                    }
            }

            emptyPostCode(){
               
                 if(this.model.address=="" || this.model.address==null)
                {
                    
                    this.model.postcode='1234';
                }
                if(this.model.paddress=="" || this.model.paddress==null){
                    this.model.ppostcode='1234';
                }
            }
    changeCallMatchingCustomerFlag()
    {
       this.oaoService.setCallMatchingCustomerFlag(false);
        console.log("CallMatchingCustomerFlag changed to:false")
    } 
    submitSection()
    {
        this.isLoading = !this.isLoading;
        this.model.no_address_found_flag = this.no_address_found_flag;

        if (this.model.postcode != null && this.model.postcode != '1234' && this.model.postcode != "") {
            this.addrErr = false;
            if (this.no_address_found_flag == 'Y') {
                // this.model.address = this.model.streetnum + " " + this.model.streetname + " " + this.model.suburb + " " + this.model.state + " " + this.model.postcode;
            }
        } else {
            this.isLoading = false;
            this.addrErr = true;
            return
        }


        if ((this.model.ppostcode != null && this.model.ppostcode != '1234' && this.model.ppostcode != "") || this.model.postal_home_address_flag == false) {
            this.paddrErr = false;
            if (this.paddrShow == true && this.model.postal_home_address_flag == true) {
                //  this.model.paddress = this.model.pstreetnum + " " + this.model.pstreetname + " " + this.model.psuburb + " " + this.model.pstate + " " + this.model.ppostcode;
            }
        }
        else {
            this.isLoading = false;
            this.paddrErr = true;
            return
        }

        if (this.model.postal_home_address_flag == false) {
            this.paddrErr = false;
            this.model.phousenum = this.model.housenum;
            this.model.pstreetnum = this.model.streetnum;
            this.model.pstreettype = this.model.streettype;
            this.model.psuburb = this.model.suburb;
            this.model.paddress = this.model.address;
            this.model.pstreetname = this.model.streetname;
            this.model.ppostcode = this.model.postcode;
            this.model.pstate = this.model.state;
        }
        this.model.app_id = this.model.application_id;
        this.model.sec_1_v = true;
        console.log("personal contact 2 ", this.model);
        this.oaoService.setPersonalDetailsObject(this.model);
                     switch(this.model.product_type_code){
                                case 'SAV':     this.oaoService.OAOCreateOrUpdateApplicant(this.model)
                                                    .subscribe(
                                                        data => {
                                                            this.model.application_id=data.Result.application_id;
                                                            this.oaoService.setPersonalDetailsObject(this.model);
                                                            this.router.navigate(["../taxInformation"], {relativeTo:this.route});
                                                    
                                        		});
                                                break;
                                case 'HML':    this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
                                                     .subscribe(
                                                        data => {
                                                            this.model.application_id=data.Result.application_id;
                                                            this.oaoService.setPersonalDetailsObject(this.model);
                                                            if(this.model.applicant=="secondary"){
                                                                this.router.navigate(['../incomeExpense'], {relativeTo:this.route});
                                                            }else{
                                                                this.router.navigate(['../propertyDetails'], {relativeTo:this.route});
                                                            }
                                                            
                                                  
                                        		});
                                                break;
                                case 'PRL':    this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.model)
                                                     .subscribe(
                                                        data => {
                                                            this.model.application_id=data.Result.application_id;
                                                            this.oaoService.setPersonalDetailsObject(this.model);
                                                            if(this.model.applicant=="secondary"){
                                                                this.router.navigate(['../incomeExpense'], {relativeTo:this.route});
                                                            }else{
                                                            this.router.navigate(['../personalLoanDeatils'], {relativeTo:this.route});
                                                    }
                                        		});
                                                break;
                                default:  console.log("Page not found");

            }
            //this.application_id=this.model.application_id;
            //localStorage.setItem('application_id',this.application_id); //for fb
        }//submitSection1

    // getAddress(str:google){
    //     this.model.address=str.formatted_address;
    // }


    showCustomAddressFields() {
        this.addrErr = false;
        this.showCustomAddr = "";
        this.no_address_found_flag = "Y";
        this.model.state = "";
        this.model.streettype = "";
        this.model.streetname = "";
        this.model.streetnum = "";
        this.model.suburb = "";
        this.model.housenum = "";
        this.model.address = '';
        //this.model.streettype = '';
        //this.model.suburb = '';
    }
    showCustomPostalAddressFields() {
        this.paddrErr = false;
        this.showCustomPAddr = "";
        this.no_address_found_flag = "Y";
        this.paddrShow = true;
        this.model.phousenum = "";
        this.model.pstate = "";
        this.model.pstreetname = "";
        this.model.pstreettype = "";
        this.model.pstreetnum = "";
        this.model.psuburb = "";
        this.model.paddress = '';
        
        // this.model.pstreettype = '';
        // this.model.psuburb = '';
    }
    hideaddress() {
        this.showCustomAddr = "true";
        this.model.address = '';
        this.no_address_found_flag = "N";
        this.model.postcode = '1234';
        this.model.housenum = "";
    }
    hidePaddress() {
        this.showCustomPAddr = "true";
        this.paddrShow = false;
        this.model.ppostcode = '1234';
        this.model.paddress = '';
        this.no_address_found_flag = "N";
        this.model.phousenum = "";
    }

                showSave(){
                if(this.check==true){
                     this.router.navigate(["../taxInformation"], {relativeTo:this.route});
                   }
                }


    ngAfterViewInit() {
        var saveFlag = false;
        var id;
        jQuery(".saveClose").click(function () {
            saveFlag = true;
        });
        jQuery('#addline1').on("focus", function () {
            id = jQuery(this).attr("id");
            console.log(id);
        });
        jQuery('#addline2').on("focus", function () {
            id = jQuery(this).attr("id");
            console.log(id);
        });

        jQuery('#addline1').on("keyup", function () {
            id = jQuery(this).attr("id");
            console.log(id);
        });


        jQuery('#addline1,#addline2').autocomplete(
            {



                source: (request, response) => {
                   // jQuery("ul.ui-autocomplete li").css("background", "green");
                    console.log("id ", id);
                    jQuery.ajax(
                        {

                            url: "https://Kleber.datatoolscloud.net.au/KleberWebService/DtKleberService.svc/ProcessQueryStringRequest",
                            dataType: "jsonp",
                            type: "GET",
                            contentType: "application/json; charset=utf-8",
                            data: { OutputFormat: "json", ResultLimit: 1000, AddressLine: request.term, Method: "DataTools.Capture.Address.Predictive.AuPaf.SearchAddress", RequestKey: "RK-93046-290D5-8CC6B-0D9DC-17F3C-BF4B3-427EC-58A53" },
                            success: (data) => {
                                console.log("data ki length: ", data.DtResponse.Result.length);
                                if (id == 'addline1' && data.DtResponse.ResultCount == 0) {
                                    this.model.postcode = "";
                                } else if (id == 'addline2' && data.DtResponse.ResultCount == 0) {
                                    this.model.ppostcode = "";
                                }
                                jQuery('#dpid').val("");
                                response(jQuery.map(data.DtResponse.Result, function (item) {
                                    //  console.log("in source ", item)
                                    console.log("item is empty: ", item.length);
                                    var Output = (item.AddressLine + ", " + item.Locality + ", " + item.State + ", " + item.Postcode);

                                    return { label: Output, value: Output, Output: Output, RecordId: item.RecordId, AddressLine: item.AddressLine };
                                }));
                            }
                        });
                },

                select: (event, ui) => {
                    jQuery.ajax(
                        {
                            url: "https://Kleber.datatoolscloud.net.au/KleberWebService/DtKleberService.svc/ProcessQueryStringRequest",
                            dataType: "jsonp",

                            crossDomain: true,
                            data: { OutputFormat: "json", RecordId: ui.item.RecordId, Method: "DataTools.Capture.Address.Predictive.AuPaf.RetrieveAddress", RequestKey: "RK-93046-290D5-8CC6B-0D9DC-17F3C-BF4B3-427EC-58A53" },
                            success: (data) => {

                                jQuery.map(data.DtResponse.Result, (item) => {
                                    console.log("data table response", item)
                                    console.log(id);
                                    console.log(id == "addline1");
                                    if (id == "addline1") {
                                        this.model.streetnum = item.StreetNumber1 + "-" + item.StreetNumber2;
                                        this.model.streetname = item.StreetName;
                                        this.model.suburb = item.Locality;
                                        this.model.postcode = item.Postcode;
                                        this.model.streettype = item.StreetType;
                                        this.model.state = item.State;
                                        this.model.address = item.BuildingName + "," + item.AddressLine + "," + item.Locality + "," + item.State + "," + this.model.postcode;
                                    } else if (id == "addline2") {
                                        // console.log("aya");
                                        this.model.pstreetnum = item.StreetNumber1 + "-" + item.StreetNumber2;
                                        this.model.pstreetname = item.StreetName;
                                        this.model.psuburb = item.Locality;
                                        this.model.ppostcode = item.Postcode;
                                        this.model.pstreettype = item.StreetType;
                                        this.model.pstate = item.State;
                                        this.model.paddress = item.BuildingName + "," + item.AddressLine + "," + item.Locality + "," + item.State + "," + this.model.ppostcode;

                                    }
                                    //this.model.address=this.model.streetnum + " " + this.model.streetname + " " + this.model.suburb + " " + this.model.state + " " + this.model.postcode;

                                    //jQuery('#addline1').val(ui.item.AddressLine);
                                    //displayMapAddress(ui.item.AddressLine + ", " + item.Locality + " " + item.State + " " + item.Postcode);     
                                });
                            }
                        });
                },
            });



    }


            ngOnInit(){
                 CommonUtils.trimWhiteSpacesOnBlur();
                 CommonUtils.completedProgressBarStep(0);
                CommonUtils.activeProgressBar();
                    this.isLoading =false;
                    this.showAddress=""
                    this.hold=true;
                        jQuery('input:visible:first').focus();
                        this.oaoService.GetPropertyDetails('INFO_MESSAGE','INF_001')
                                .subscribe(
                                    data =>{
                                         this.inf_001=data.result[0].property_value;
                                    }
                                );

                       this.oaoService.GetPropertyDetails('WARN_MESSAGE','WRN_001')
                                .subscribe(
                                    data =>{
                                         this.wrn_001=data.result[0].property_value;
                                    }
                                );
                        this.oaoService.GetPropertyDetails('commonCodes','STATE')
                                .subscribe(
                                            data =>{
                                                var count   =   Object.keys( data.result ).length;
                                                    for(var i = 0; i < count; i++){
                                                        this.state_drop.push(data.result[i].property_desc)
                                                    }
                                            }
                                );
                        this.oaoService.GetPropertyDetails('commonCodes','STREET_TYPE')
                                .subscribe(
                                            data =>{
                                                var count   =   Object.keys( data.result ).length;
                                                    for(var i = 0; i < count; i++){
                                                        this.street.push(data.result[i].property_desc)
                                                    }
                                            }
                                );


                 //for fb data
                if (this.oaoService.getFbData() == true) {
                    this.model = this.oaoService.getData();
                }
                 if(this.model.address!=null || this.model.paddress!=null){
                       this.showAddress=""
                       this.hold=true;
                }
                      }

         updateSection(){
             CommonUtils.activeProgressBar();
           
             
            //   this.router.navigate(["../personalBasicInfo"], {relativeTo:this.route});
            this.oaoService.updatesection("section_1",this.model.application_id).subscribe(
                                    data =>{
                                        console.log(data);
                                         console.log("updated");
                                         this.router.navigate(["../personalBasicInfo"], {relativeTo:this.route});
                                    });

        }


		 laddaclose(){
            this.isLoading=false;
        }

}
