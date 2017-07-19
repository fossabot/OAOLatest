import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Common } from "../../validators/commonFunc";
import { ConfigDetails } from "../../interfaces/configinterface";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import { CommonUtils } from '../../validators/commonUtils';

declare var jQuery: any;
// declare var Ladda:any;
@Component({
    selector: 'property-details',
    templateUrl: './propertyDetails.component.html'

})
export class PropertyDetailsComponent implements OnInit {
    public application_id: any;
    configMsg: ConfigDetails;
    radioflag:Boolean = true;
    yesNoflag:Boolean = false;
    ownershipTypeFlag:Boolean = true;
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    public propType: any[] = [];
    public showCustomAddr: String = "true";
    public paddrShow: boolean = false;
    public street: String[] = [];
    public state_drop: String[] = [];
    public no_address_found_flag: string;
    public addrErr = false;

    isLoading: boolean = false;


    constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute) {
        console.log("PropertyDetailsComponent  constructor()")
        this.model = this.oaoService.getPersonalDetailsObject();
        if (this.model.proppostcode == undefined) {
            this.model.proppostcode = "1234";

        }
        if (this.model.propstate == undefined) {
            this.model.propstate = "";
        }
        if (this.model.propstreettype == undefined) {
            this.model.propstreettype = "";
        }
        this.no_address_found_flag = "N";
        if (this.model.prophousenum != "" && this.model.prophousenum != "undefined" && this.model.prophousenum != null) {
            this.no_address_found_flag = "Y";
            this.showCustomAddr = "";
        }
        console.log(this.model);
    }
    showCustomAddressFields() {
        this.addrErr = false;
        this.showCustomAddr = "";
        this.no_address_found_flag = "Y";
        this.model.propaddr = '';
        this.model.propstreettype = '';
        this.model.propsuburb = '';

    }

    changeRadio(){
        console.log("halua",this.radioflag);
        this.radioflag=!(this.radioflag);
    }
    ngOnInit() {
        CommonUtils.trimWhiteSpacesOnBlur();
        CommonUtils.completedProgressBarStep(1);
        CommonUtils.activeProgressBar();
        jQuery('input:visible:first').focus();
        if (this.model.loantype == null) {
            this.model.loantype = "REFINANCE";
        }
        if (this.model.ownership == null) {
            this.model.ownership = "OWNER OCCUPIER";
        }
        if (this.model.proptype == null) {
            this.model.proptype = '0';
        }

        this.oaoService.getConfig()
            .subscribe((data) => {
                this.configMsg = JSON.parse(JSON.stringify(data.data));
                console.log(this.configMsg)
            });

        this.oaoService.GetPropertyDetails('commonCodes', 'PROP_TYPE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.propType.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
            }
            );

        this.oaoService.GetPropertyDetails('commonCodes', 'STREET_TYPE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.street.push(data.result[i].property_desc)
                }
            }
            );

        this.oaoService.GetPropertyDetails('commonCodes', 'STATE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.state_drop.push(data.result[i].property_desc)
                }
            }
            );

    }

    clik(e:any){
 var curObj = e.currentTarget;
             

              var currentElement = '#' + jQuery(curObj).attr('id');
              var selectedItem = '.' + jQuery(currentElement).prev().attr('class');
              console.log('current..',jQuery(this).prev().attr('class'))
             


        
    }
    ngAfterViewInit() {
        this.model.property="Yes";
        this.model.loantype="REFINANCE";
        
        jQuery("#radio1").unbind('click');
        jQuery("#radio1").click(()=>{
            console.log("halua",this.radioflag);
            if(this.radioflag==false){
                this.radioflag=!this.radioflag;
                this.model.loantype="REFINANCE";
            }
                return false;
           
            
        })
        jQuery("#radio2").click(()=>{
            console.log("halua",this.radioflag);
            if(this.radioflag==true){
           this.radioflag=!this.radioflag;
           this.model.loantype="NEW PURCHASE";
           this.model.property="Yes";
           this.yesNoflag=false;
            }
            return false;
           
        })

        jQuery("#radio3").click(()=>{
            console.log("halua",this.yesNoflag);
            if(this.yesNoflag==false){
                this.yesNoflag=!this.yesNoflag;
                this.model.property="No";
            }
                return false;
           
            
        })
        jQuery("#radio4").click(()=>{
            console.log("halua",this.yesNoflag);
            if(this.yesNoflag==true){
           this.yesNoflag=!this.yesNoflag;
           this.model.property="Yes";
            }
            return false;
           
        })
        
        jQuery("#radio5").click(()=>{
            console.log("halua",this.ownershipTypeFlag);
            if(this.ownershipTypeFlag==false){
                this.ownershipTypeFlag=!this.ownershipTypeFlag;
                this.model.ownership="OWNER OCCUPIER"
            }
                return false;
           
            
        })
        jQuery("#radio6").click(()=>{
            console.log("halua",this.ownershipTypeFlag);
            if(this.ownershipTypeFlag==true){
           this.ownershipTypeFlag=!this.ownershipTypeFlag;
           this.model.ownership="INVESTMENT";
            }
            return false;
           
        })
        /*jQuery('span.list-item-selected').hide();
        jQuery('.list-item has-icon').click( () => {
            alert("click hua")
            var input_class = jQuery(this).attr('id');
            console.log("input_class: ",input_class);
            jQuery('#' + input_class +'> .list-item-select-text').hide();


           
        });*/
        /*  jQuery('input:checkbox').change(function(event){
              var curObj = jQuery(event.currentTarget);
              console.log(curObj);
          if(jQuery(this).is(":checked")) {
             // jQuery('div.menuitem').addClass("menuitemshow");
            jQuery('.list-item-select-text').hide();
            jQuery('.list-item-selected').show();
            jQuery('.list-item has-icon').css('border-color', '#60D154');
             console.log('true');
          } else {
                   jQuery('.list-item-select-text').show();
            jQuery('.list-item-selected').hide();
                
                console.log('false');
          }
      });*/
        jQuery('#addline1').autocomplete(
            {
                source: (request, response) => {

                    jQuery.ajax(
                        {

                            url: "https://Kleber.datatoolscloud.net.au/KleberWebService/DtKleberService.svc/ProcessQueryStringRequest",
                            dataType: "jsonp",
                            type: "GET",
                            contentType: "application/json; charset=utf-8",
                            data: { OutputFormat: "json", ResultLimit: 1000, AddressLine: request.term, Method: "DataTools.Capture.Address.Predictive.AuPaf.SearchAddress", RequestKey: "RK-93046-290D5-8CC6B-0D9DC-17F3C-BF4B3-427EC-58A53" },
                            success: (data) => {
                                if (data.DtResponse.ResultCount == 0) {
                                    this.model.proppostcode = "";
                                }
                                jQuery('#dpid').val("");
                                response(jQuery.map(data.DtResponse.Result, function (item) {
                                    //  console.log("in source ", item)
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
                                    //console.log("in select ", item)

                                    this.model.propstreetnum = item.StreetNumber1 + "-" + item.StreetNumber2;
                                    this.model.propstreetname = item.StreetName;
                                    this.model.propsuburb = item.Locality;
                                    this.model.proppostcode = item.Postcode;
                                    this.model.propstreettype = item.StreetType;
                                    this.model.propstate = item.State;
                                    this.model.propaddr = item.BuildingName + "," + item.AddressLine + "," + item.Locality + "," + item.State + "," + this.model.proppostcode;

                                });
                            }
                        });
                },
            });
    }

    onSubmit() {
        this.isLoading = !this.isLoading;
        this.model.app_id = this.model.application_id;
        this.model.sec_2_v = false;
        if ((!String(this.model.payoutbal).match(/\./g) || String(this.model.payoutbal).match(/\./g)) && String(this.model.payoutbal).match(/\,/g)) {
            var payoutbal = this.model.payoutbal.replace(/\,/g, "");
            this.model.payoutbal = payoutbal;
        }
        if ((!String(this.model.rentalincome).match(/\./g) || String(this.model.rentalincome).match(/\./g)) && String(this.model.rentalincome).match(/\,/g)) {
            var rentalincome = this.model.rentalincome.replace(/\,/g, "");
            this.model.rentalincome = rentalincome;
        }
        if ((!String(this.model.purchaseprice).match(/\./g) || String(this.model.purchaseprice).match(/\./g)) && String(this.model.purchaseprice).match(/\,/g)) {
            var purchaseprice = this.model.purchaseprice.replace(/\,/g, "");
            this.model.purchaseprice = purchaseprice;
        }
        if(this.model.property!="No" && this.model.loantype!="NEW PURCHASE"){
        this.model.no_address_found_flag = this.no_address_found_flag;
        if (this.model.proppostcode != null && this.model.proppostcode != '0000' && this.model.proppostcode != "") {
            this.addrErr = false;

        } else {
            this.isLoading = false
            this.addrErr = true;
            return
        }
    }


        console.log("updated" + this.model);
        console.log(this.model);
        this.oaoService.setPersonalDetailsObject(this.model);



        this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
            .subscribe(
            data => {
                console.log("sample" + data);


                this.router.navigate(['../loanDetails'], { relativeTo: this.route });
            }
            );


    }//onSubmit

    emptyPostCode() {

        if (this.model.propaddr == "" || this.model.propaddr == null) {

            this.model.proppostcode = "1234";
        }
    }
    updateSection() {

        CommonUtils.removeMobileProgressBar(1);

        this.oaoService.updatesection("section_1", this.model.application_id).subscribe(
            data => {
                console.log(data);
                console.log("updated");
                this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
            }
        );
    }

    clear(radio_var: any) {
        switch (radio_var) {
            case 'REFINANCE': this.model.property = '';
                break;
            case 'NEW PURCHASE': this.model.property = 'Yes';
                this.model.payoutbal = '';
                break;
            case 'OWNEROCCUPIER': this.model.rentalincome = null;
                break;
        }
    }
    AmountFormatter(amountvalue: any, var_v: any) {
        if (amountvalue != undefined && amountvalue != null && amountvalue != '') {
            console.log("asd " + amountvalue + " " + var_v)
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'AUD',
                minimumFractionDigits: 2,
            });
            //     this.testmodel[var_v]="";
            //  this.testmodel[var_v]=amountvalue;
            var finalString = formatter.format(amountvalue);
            finalString = finalString.replace('A$', '');
            this.model[var_v] = finalString.replace('$', '');
        } else {
            this.model[var_v] = "0.0";
        }
    }

    revert(oldvalue: any, var_v: any) {
        var tmpOldvalue;
        if (oldvalue != null && String(oldvalue).match(/\,/g)) {
            tmpOldvalue = oldvalue.replace(/\,/g, '');
            console.log(tmpOldvalue);
            this.model[var_v] = tmpOldvalue.substr(0, tmpOldvalue.length - 3);
            console.log(this.model[var_v]);
        }
    }
    hideaddress() {
        this.showCustomAddr = "true";
        this.model.propaddr = '';
        this.model.proppostcode = '1234';
        this.no_address_found_flag = "N";
        this.model.prophousenum = "";
    }

}