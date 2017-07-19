import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { ConfigDetails } from "../../interfaces/configinterface";
import { OAOService } from "../../services/OAO.Service"
import { CommonUtils } from '../../validators/commonUtils';
import {GoogleAnalyticsEventsService } from "../../services/GoogleAnalyticsEvents.Service";
//import { CrossSellDetailsObject } from "../../interfaces/crossSellDetails.interface";
declare var jQuery: any;
declare var Ladda
@Component({
    selector: 'onlineidcheck',
    templateUrl: './onlineIdCheck.component.html',
    providers: [DatePipe]

})
export class OnlineIdCheckComponent implements OnInit {

    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    crossmodel = new PersonalDetailsObject('', '', '', '', '', '', '');
    public items: any[] = [];
    public cardColor: any[] = [];
    public state: any[] = [];
    private check: boolean = false;
    idCheck_v: String;
    public inf_002: String;
    public inf_006: String;
    public inf_007: String;
    public passport_check: String;
    public DL_check: String;
    public Medicare_check: String;
    max_year: Number;
    public inf_003: String;
    public wrn_002: String;
    application_id: any;
    configMsg: ConfigDetails
    prod_type: string;
    product_type_code: string;
    cs_product_type_code: string;
    public inf_loan: string;
    date_v = new Date();
    isLoading: boolean = false;
    public products: Array<any> = [];
    public isCrossSell: boolean;
    public isAdmin: boolean;
    public verification_auto:boolean;
    //public onboard_auto:boolean
    /**Initialization for md2 date component */
    isRequired = false;
    isDisabled = false;
    isOpenOnFocus = false;
    isOpen = false;
    today: Date = new Date();
    type: string = 'date';
    types: Array<any> = [
        { text: 'Date', value: 'date' },
        { text: 'Time', value: 'time' },
        { text: 'Date Time', value: 'datetime' }];

    mode: string = 'auto';
    modes: Array<any> = [
        { text: 'Auto', value: 'auto' },
        { text: 'Portrait', value: 'portrait' },
        { text: 'Landscape', value: 'landscape' }];

    container: string = 'inline';
    containers: Array<any> = [
        { text: 'Inline', value: 'inline' },
        { text: 'Dialog', value: 'dialog' }];

    date: Date = null;
    minDate: Date = null;
    maxDate:string;
    //maxDate: Date =  new Date(this.today.getFullYear()+100, this.today.getMonth(), this.today.getDate());

    // enableDates: Array<Date> = [
    //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 7),
    //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 1),
    //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 5),
    //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 7),
    //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 8)
    // ];
    // disableDates: Array<Date> = [
    //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 2),
    //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 1),
    //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 2),
    //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 5),
    //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 9)
    // ];
    //disableWeekDays: Array<number> = [0, 6];



    openDatepicker() {
        this.isOpen = true;
        setTimeout(() => {
            this.isOpen = false;
        }, 1000);
    }
    /**end of md2 component */
    file_type: string;
    constructor(private oaoService: OAOService, private router: Router, private datePipe: DatePipe, private route: ActivatedRoute,private gaEventsService: GoogleAnalyticsEventsService) {
        this.maxDate = this.datePipe.transform(this.today.getFullYear() + 100+'-'+ this.today.getMonth()+'-'+ this.today.getDate(), 'yyyy-MM-dd');
        this.file_type = "Passport";
        this.isCrossSell = false;
        console.log("OnlineIdCheckComponent constructor()")
        this.model = this.oaoService.getPersonalDetailsObject();
        this.isAdmin = this.model.is_admin;
        console.log(this.oaoService.getPersonalDetailsObject())
        this.product_type_code = this.model.product_type_code;
        this.oaoService.GetProduct(this.model.product_code)
            .subscribe(data => {
                console.log('Product', data.result[0]);
                if (data.result[0] === undefined) {
                    this.products = [];
                } else {
                    this.products = data.result[0].display_text;
                    this.cs_product_type_code = data.result[0].product_type_code;
                }

            })
            this.oaoService.getProductDetails(this.model.product_code).subscribe(
                data=>{
                    console.log("product details",data[0])
                    console.log(data[0].verification_mode);
                    this.verification_auto= data[0].verification_mode;
                }
            )
        // this.oaoService.GetPropertyDetails('GENERIC_PROP', 'VERIFICATION_AUTO').subscribe(
        //     data => {
        //         console.log("getting ver status....");
        //         console.log(data);
        //         this.verification_auto= data.result[0].property_value;
        //     }
        // );
        //   this.oaoService.GetPropertyDetails('GENERIC_PROP', 'ONBOARD_AUTO').subscribe(
        //     data => {
        //         console.log(data);
        //         this.onboard_auto= data.result[0].property_value;
        //     }
        // );


        this.max_year = 0;
        this.oaoService.getConfig()
            .subscribe((data) => {
                this.configMsg = JSON.parse(JSON.stringify(data.data));
            }
            );



    }
    //file type
    setFileType(type: string) {
        this.file_type = type;
        switch (this.file_type) {
            case 'Passport': this.router.navigate(["../onlineIdCheck/Passport"], { relativeTo: this.route });
                console.log('Passport Selected');
               // jQuery('#fileupload-modal').modal('show');
                break;
            case 'Medicare': this.router.navigate(["../onlineIdCheck/Medicare"], { relativeTo: this.route });
                console.log('Medicare Selected');
                //jQuery('#fileupload-modal').modal('show');
                break;
            case 'DrivingLicense': this.router.navigate(["../onlineIdCheck/DrivingLicense"], { relativeTo: this.route });
                console.log('DrivingLicense Selected');
                //jQuery('#fileupload-modal').modal('show');
                break;
        }

    }
    changeType() {
        console.log("this.file_type");
        console.log(this.file_type);
    }

    onidcheck() {

        console.log("onidcheck()");
        this.isLoading = !this.isLoading;

        this.model.skip = true;
          var formatedDate = this.datePipe.transform(this.model.validTo,'MM/dd/yyyy');
          console.log('Formated date id Check',formatedDate);
         this.model.validTo = formatedDate;

        console.log("Rajath")


        this.oaoService.onlineIdcheck(this.model)
            .subscribe(
            data => {
                if (data.pass == "success" || data.dl == "success" || data.mc == "success") {
                    this.passport_check = data.pass
                    this.DL_check = data.dl
                    this.Medicare_check = data.mc
                    jQuery('#onlineidcheck').modal('show');
                }
                else if (data.server == "error") {
                    jQuery('#servererror').modal('show');
                }
                else {
                    this.passport_check = "passport not verified"
                    this.DL_check = "Dl not verified"
                    this.Medicare_check = "medicare not verified"
                    jQuery('#error').modal('show');
                }
            }
            );
    }

    onSubmit() {

        this.model.skip = true;
        this.model.verification_auto=this.verification_auto;
        //this.model.onboard_auto=this.onboard_auto;

        switch (this.model.product_type_code) {

            case 'SAV': this.oaoService.OAOCreateOrUpdateApplicant(this.model)
                .subscribe(
                data => {
                    // this.oaoService.setData(data.Result);
                    this.check = true;
                    this.showSave();
                }
                );
                break;
            case 'HML': this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
                .subscribe(
                data => {
                    // this.oaoService.setData(data.Result);
                    if (this.isCrossSell) {
                        this.gaEventsService.emitEvent('OAO_CrossSell', this.crossmodel.product_name, window.location.pathname, 1);
                        this.createCrossSellApplicants();
                    }
                    this.successLoan();
                }
                );
                break;
            case 'PRL': this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.model)
                .subscribe(
                data => {
                    // this.oaoService.setData(data.Result);
                    if (this.isCrossSell) {
                        this.createCrossSellApplicants();
                    }
                    this.successLoan();
                }
                );
                break;
            default: console.log("Page not found");

        }
    }
    onSave() {
        console.log("onsave()");
        this.oaoService.OAOSaveApplicant(this.model)
            .subscribe(
            data => {
                console.log(data);
                jQuery('#success-admin').modal('show');
            }
            );



    }


    showSave() {
        if (this.check == true) {
            this.oaoService.GetApplicantsDetail(this.model.application_id)
                .subscribe(
                data => {
                    this.model = data.result[0];
                    if (this.isCrossSell) {
                        this.createCrossSellApplicants();
                    }
                    //localStorage.clear();

                    if (this.isAdmin == true) {
                        console.log("application successfully saved by admin");
                        jQuery('#success-admin').modal('show');
                    } else if(data.result[0].application_status=='ONBOARD'){
                        jQuery('#success-1').modal('show');
                    }else{
                         jQuery('#success_loan').modal('show');
                    }

                });

        }
    }
    public inf_code: string = '';
    successLoan() {
        console.log('success model', JSON.stringify(this.model));
        if (this.model.product_code == 'HML') {
            this.inf_code = 'INF_004'
        } else {
            this.inf_code = 'INF_005'
        }
        //Info message 004
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', this.inf_code)
            .subscribe(
            data => {
                this.inf_loan = data.result[0].property_value;
                if (this.isAdmin == true) {
                    console.log("application successfully saved by admin");
                    jQuery('#success-admin').modal('show');
                } else {
                    jQuery('#success_loan').modal('show');
                }
                
            }
            );

    }

    ngOnInit() {
        if(this.model.product_type_code === 'SAV'){
            CommonUtils.activeProgressBarStep(3);
            CommonUtils.completedProgressBarStep(2);

        }else{
             CommonUtils.activeProgressBarStep(4);
            CommonUtils.completedProgressBarStep(3);
        }
       

        if (this.model.idstate == null) {
            this.model.idstate = '0';
        }
        if (this.model.color == null) {
            this.model.color = '0';
        }
        if (this.model.DLidState == null) {
            this.model.DLidState = '0';
        }


        this.oaoService.GetPropertyDetails('commonCodes', 'COUNTRY')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.items.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
                this.items.sort();
            }
            )

        this.oaoService.GetPropertyDetails('commonCodes', 'CRDCLR')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.cardColor.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
            }
            )

        this.oaoService.GetPropertyDetails('commonCodes', 'STATE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.state.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
            }
            );

        this.oaoService.GetPropertyDetails('turnOnOff', 'idCheck')
            .subscribe(
            data => {
                this.idCheck_v = data.result[0].property_value
                console.log(this.idCheck_v)
            }
            );
        //Info message 003
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_003')
            .subscribe(
            data => {
                this.inf_003 = data.result[0].property_value;
            }
            );
        //Info message 002
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_002')
            .subscribe(
            data => {
                this.inf_002 = data.result[0].property_value;
            }
            );
        //Info message 006
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_006')
            .subscribe(
            data => {
                this.inf_006 = data.result[0].property_value;
            }
            );
        //Info message 007
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_007')
            .subscribe(
            data => {
                this.inf_007 = data.result[0].property_value;
            }
            );
        this.oaoService.GetPropertyDetails('GENERIC_PROP', 'VALID_TO_MEDI')
            .subscribe(
            data => {
                this.max_year = data.result[0].property_value;
                console.log(this.max_year);
            }
            );

        this.oaoService.GetPropertyDetails('WARN_MESSAGE', 'WRN_002')
            .subscribe(
            data => {
                this.wrn_002 = data.result[0].property_value;
            }
            );

    }//ngOnInit

    getAccno() {
        console.log("in acc")
        // this.model=this.oaoService.getData();
        this.model.skip = true;
        // this.onSubmit(this.model);
        this.model.app_id = this.model.application_id;
        this.model.verification_auto=this.verification_auto;
        //this.model.onboard_auto=this.onboard_auto;
          this.oaoService.GetPropertyDetails('INFO_MESSAGE','INF_004')
            .subscribe(
            data => {
                this.inf_loan = data.result[0].property_value;
            });
        console.log(this.model)
        this.oaoService.OAOCreateOrUpdateApplicant(this.model)
            .subscribe(
            data => {
                console.log('data', data);
                // this.oaoService.setData(data.Result);
                //  this.model=this.oaoService.getData();
                this.oaoService.GetApplicantsDetail(this.model.app_id)
                    .subscribe(
                    data => {
                        console.log('**************')
                        this.model = data.result[0];
                        /**cross sell creation */
                        console.log('cross sell check', this.isCrossSell);
                        if (this.isCrossSell) {
                            this.createCrossSellApplicants();
                        }
                        if(data.result[0].application_status=='ONBOARD'){
                        jQuery('#success').modal('show');
                    }else{
                         jQuery('#success_loan').modal('show');
                    }
                        //localStorage.clear();
                    });

            }
            );


    }


    updateSection() {
//CommonUtils.completedProgressBarStep(1);
CommonUtils.removeMobileProgressBar(2);
switch (this.model.product_type_code) {
            case 'SAV':
                this.oaoService.updatesection("section_2", this.model.application_id).subscribe(
                    data => {
                        this.router.navigate(["../taxInformation"], { relativeTo: this.route });
                    })
                break;
            case 'HML':
                this.oaoService.updatesection("section_3", this.model.application_id).subscribe(
                    data => {
                        this.router.navigate(['../aboutYou'], { relativeTo: this.route });
                    });
                break;
            case 'PRL':
                this.oaoService.updatesection("section_3", this.model.application_id).subscribe(
                    data => {
                        this.router.navigate(['../aboutYou'], { relativeTo: this.route });
                    });
                break;
            default: console.log("Page not found");
        }
    }

    dispDate(validto: any) {
        this.model.validTo = validto;
    }
    ngAfterViewInit() {

        var mon = this.date_v.getMonth() + 1;
        var year = this.date_v.getFullYear();
        //this.model.validTo = this.date_v.getDate() + "/" + mon + "/" + year;
        var options = {
            format: "dd/mm/yyyy"
        }
        if (jQuery('.datepicker') && jQuery('.datepicker').length) {
            jQuery('.datepicker').dateDropper(options);
        }
        jQuery('body').on('change', '#validTo', function () {
            jQuery('#validTo').trigger('click');
        });
    }
    clear() {
       window.location.href=this.oaoService.baseURL;
        localStorage.clear();
    }

    back() {
        this.isLoading = false;
    }


    moveForward() {
        CommonUtils.completedProgressBarStep(3);
    }


    createCrossSellApplicants() {
        console.log('Inside Cross applicants...');
        this.crossmodel = this.oaoService.getPersonalDetailsObject();
        this.crossmodel.main_app_no = this.model.application_id;
        this.crossmodel.main_prod_type = this.model.product_type_code;
        this.crossmodel.main_prod = this.model.product_code;
        console.log('CS Main Prod', this.crossmodel.main_prod_type);
        console.log("main Prod type", this.model.product_type_code);
        this.oaoService.GetProduct(this.model.product_code)
            .subscribe(data => {
                console.log(data);
                console.log(this.cs_product_type_code);
                this.crossmodel.product_type_code = data.result[0].child_of;
                this.crossmodel.product_code = data.result[0].product_code;
                console.log('Cross Model', JSON.stringify(this.crossmodel));
                this.oaoService.OAOCrossSellCreate(this.crossmodel)
                    .subscribe(
                    data => { console.log("main model", this.model.application_id); }

                    );

            })

    }

    setCrossSell(event) {
        console.log(JSON.stringify(event));
        console.log('Cross sell chekbox clicked', event.target.checked);
        this.gaEventsService.emitEvent('OAO_CrossSell',window.location.pathname, this.crossmodel.product_name,1);
        this.isCrossSell = event.target.checked;
    }

    openTerms(){
        var shareLink = '/crossSellTerms';
            window.open(shareLink, 'mywin',
        'left=20,top=20,width=500,height=500,toolbar=1,resizable=0');
        
    }
}