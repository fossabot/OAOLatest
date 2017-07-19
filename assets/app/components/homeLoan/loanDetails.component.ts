import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigDetails } from "../../interfaces/configinterface";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import { AlphanumericValidator } from "../../validators/alphanumeric_validator";
import { CommonUtils } from "../../validators/commonUtils";
declare var jQuery: any;
// declare var Ladda:any;
@Component({
    selector: 'loan-details',
    templateUrl: './loanDetails.component.html'

})
export class LoanDetailsComponent implements OnInit {
    public TimeFlag: boolean = false;
     public DisableFlag: boolean = false;
    public emiamount: any;
    public amtborrow:any;
    public months: any;
    public loanterm:any;
    public repaymentamount: string;
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    configMsg: ConfigDetails;
    consolidateMortage: Boolean;
    public frequencyTypes: any[] = [];
    public loanTerm: any[] = [];
    public repaymentType: any[] = [];
    isLoading: Boolean = false;
    public showCustomAddr: String = "true";
    public paddrShow: boolean = false;
    public street: String[] = [];
    public state_drop: String[] = [];
    public no_address_found_flag: string;
    public addrErr = false;
    public availableProduct: any[]=[];
    public estvalue_v;
    public cc_estvalue_v;
    public pl_estvalue_v;
    public cl_estvalue_v;
    public sl_estvalue_v;
    public o_estvalue_v;
    public totalamount: number;
    constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute) {
       // this.model.frequencyType = "Monthly";
        console.log("LoanDetailsComponent  constructor()")
        this.model = this.oaoService.getPersonalDetailsObject();
        //this.model.product_name = 'dsa';
        this.oaoService.getRealtiveProduct(this.model.product_type_code).subscribe(
            data => {
                console.log("products", data);
                this.availableProduct = data;
                console.log("products", this.availableProduct);
                this.calculate();
                console.log("calculating......")
            }
        )
        this.oaoService.GetProductDetail(this.model.product_code).subscribe(
            data => {
                console.log(data);
                console.log(data.result[0].interest_type)
                this.model.interesttype=data.result[0].interest_type;
                console.log("interesttype",this.model.interesttype)
            }
        )
        if (this.model.proppostcode_m == undefined) {
            this.model.proppostcode_m = "1234";
        }
        if (this.model.propstate_m == undefined) {
            this.model.propstate_m = "";
        }
        if (this.model.propstreettype_m == undefined) {
            this.model.propstreettype_m = "";
        }
        console.log(this.model);
        if (this.model.prophousenum_m != null && this.model.prophousenum_m != "" && this.model.prophousenum_m != undefined) {
            this.no_address_found_flag = "Y";
            this.showCustomAddr = "";

        }
        this.oaoService.getConfig()
            .subscribe((data) => { this.configMsg = JSON.parse(JSON.stringify(data.data)); });

    }
    showCustomAddressFields() {
        this.addrErr = false;
        this.showCustomAddr = "";
        this.no_address_found_flag = "Y";
        this.model.propaddress_m = '';
        this.model.prophousenum_m = "";
        this.model.propstreetname_m = "";
        this.model.propstate_m = "";
        this.model.propsuburb_m = "";
        this.model.propstreettype_m = "";
        this.model.propstreetnum_m = "";
    }
    hideaddress() {
        this.showCustomAddr = "true";
        this.model.propaddress_m = '';
        this.model.proppostcode_m = '1234';
        this.no_address_found_flag = "N";
        this.model.prophousenum_m = "";
    }

    ngOnInit() {
        jQuery('input:visible:first').focus();
        if (this.model.frequencyType == null || this.model.interesttype == null) {
            // this.model.frequencyType = "Monthly";
            //this.model.interesttype = "FIXED";
        }
        if (this.model.loanterm == null) {
            this.model.loanterm = '0';
        }
        if (this.model.repaymenttype == null) {
            this.model.repaymenttype = '0';
        }
        if (this.model.frequencyType == null) {
            this.model.frequencyType = '0';
        }
        this.oaoService.GetPropertyDetails('commonCodes', 'frequency_type')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.frequencyTypes.push({
                        property_desc: data.result[i].property_desc,
                        property_value: data.result[i].property_value
                    })
                }
                console.log("frequencyTypes: ", this.frequencyTypes);
              //  this.model.frequencyType = this.frequencyTypes[0].property_val;
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'LOAN_TERM')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.loanTerm.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'REPAYMENT_TYPE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.repaymentType.push({
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
        if (this.model.amtborrow != undefined) {
            this.model.amtborrow = this.model.amtborrow.toString();
            var amtborrow = this.model.amtborrow.replace(/\,/g, '');
            this.model.amtborrow = amtborrow;

        }
        if(this.model.repaymentAmount!='0' && this.model.repaymentAmount!=null && (this.model.repaymentAmount!=undefined)){
            console.log("not equal to zero");
            console.log("val",this.model.repaymentAmount)
            jQuery('#Amount-tab').click();
        }
    }

    ngAfterViewInit() {

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
                                    this.model.proppostcode_m = "";
                                }
                                jQuery('#dpid').val("");
                                response(jQuery.map(data.DtResponse.Result, function(item) {
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

                                    this.model.propstreetnum_m = item.StreetNumber1 + "-" + item.StreetNumber2;
                                    this.model.propstreetname_m = item.StreetName;
                                    this.model.propsuburb_m = item.Locality;
                                    this.model.proppostcode_m = item.Postcode;
                                    this.model.propstreettype_m = item.StreetType;
                                    this.model.propstate_m = item.State;
                                    this.model.propaddress_m = item.BuildingName + "," + item.AddressLine + "," + item.Locality + "," + item.State + "," + this.model.proppostcode_m;

                                });
                            }
                        });
                },
            });
        this.calculate();
    }

    onSubmit() {
        console.log("emi",this.model.interest_rate);
        console.log("emi",this.model.emi);
        this.isLoading = !this.isLoading;
        this.model.sec_2_v = true;
        if ((!String(this.model.amtborrow).match(/\./g) || String(this.model.amtborrow).match(/\./g)) && String(this.model.amtborrow).match(/\,/g)) {
            var amtborrow = this.model.amtborrow.replace(/\,/g, "");
            this.model.amtborrow = amtborrow;
        }
        if ((!String(this.model.repaymentAmount).match(/\./g) || String(this.model.repaymentAmount).match(/\./g)) && String(this.model.repaymentAmount).match(/\,/g)) {
            var repaymentAmount = this.model.repaymentAmount.replace(/\,/g, "");
            this.model.repaymentAmount = repaymentAmount;
        }
        if (this.model.consolidateMortage == true) {
            if ((!String(this.model.estvalue).match(/\./g) || String(this.model.estvalue).match(/\./g)) && String(this.model.estvalue).match(/\,/g)) {
                var estvalue = this.model.estvalue.replace(/\,/g, "");
                this.model.estvalue = estvalue;
            }
            this.model.no_address_found_flag = this.no_address_found_flag;

            if (this.model.proppostcode_m != "" && this.model.proppostcode_m != null && this.model.proppostcode_m != '1234') {
                this.addrErr = false;
                if (this.no_address_found_flag == 'Y') {
                    // this.model.propaddress_m = this.model.propstreetnum_m + " " + this.model.propstreetname_m + " " + this.model.propsuburb_m + " " + this.model.propstate_m + " " + this.model.proppostcode_m;
                }

            } else {
                this.isLoading = false;
                this.addrErr = true;
                return
            }
        }
        if (this.model.consolidateotherMortage == true) {
            if ((!String(this.model.cc_estvalue).match(/\./g) || String(this.model.cc_estvalue).match(/\./g)) && String(this.model.cc_estvalue).match(/\,/g)) {
                var cc_estvalue = this.model.cc_estvalue.replace(/\,/g, "");
                this.model.cc_estvalue = cc_estvalue;
            }
            if ((!String(this.model.pl_estvalue).match(/\./g) || String(this.model.pl_estvalue).match(/\./g)) && String(this.model.pl_estvalue).match(/\,/g)) {
                var pl_estvalue = this.model.pl_estvalue.replace(/\,/g, "");
                this.model.pl_estvalue = pl_estvalue;
            }
            if ((!String(this.model.cl_estvalue).match(/\./g) || String(this.model.cl_estvalue).match(/\./g)) && String(this.model.cl_estvalue).match(/\,/g)) {
                var cl_estvalue = this.model.cl_estvalue.replace(/\,/g, "");
                this.model.cl_estvalue = cl_estvalue;
            }
            if ((!String(this.model.sl_estvalue).match(/\./g) || String(this.model.sl_estvalue).match(/\./g)) && String(this.model.sl_estvalue).match(/\,/g)) {
                var sl_estvalue = this.model.sl_estvalue.replace(/\,/g, "");
                this.model.sl_estvalue = sl_estvalue;
            }
            if ((!String(this.model.o_estvalue).match(/\./g) || String(this.model.o_estvalue).match(/\./g)) && String(this.model.o_estvalue).match(/\,/g)) {
                var o_estvalue = this.model.o_estvalue.replace(/\,/g, "");
                this.model.o_estvalue = o_estvalue;
            }

        }

        this.oaoService.setPersonalDetailsObject(this.model);
        console.log(this.model);



        this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
            .subscribe(
            data => {
                console.log("sample", data);
                this.router.navigate(['../loanSummary'], { relativeTo: this.route });
            }
            );

    }
    updateSection() {
        // CommonUtils.completedProgressBarStep(1);

        this.oaoService.updatesection("section_2", this.model.application_id).subscribe(
            data => {
                console.log(data);
                console.log("updated");
                this.router.navigate(['../propertyDetails'], { relativeTo: this.route });
            }
        );
    }
    emptyPostCode() {
        if (this.model.propaddress_m == "" || this.model.propaddress_m == null) {
            this.model.proppostcode_m = "1234";
        }
    }
    disableButton() {
        if (this.model.consolidateMortage == true) {
            if (this.model.propaddress_m == null || this.model.proppostcode_m == '' || this.model.proppostcode_m == null || this.model.proppostcode_m == '1234') {
                return true;
            }
        }
        return false;
    }
    percentage_var: any
    checkPercentage() {

        this.percentage_var = 100 - parseInt(this.model.fixedper);
        this.model.variableper = this.percentage_var;

    }
    clear(radio_var: any) {
        switch (radio_var) {
            case 'FIXED': this.model.fixedper = '';
                this.model.variableper = ''
                break;
            case 'VARIABLE': this.model.fixedper = '';
                this.model.variableper = ''
                break;
        }
    }
    clearCheckbox(checkbox_var: any, cond: boolean) {
        switch (checkbox_var) {
            case 'consolidateMortage': if (cond == false) {
                this.model.estvalue = '';
                this.model.finInstitution = '';
                this.model.prophousenum_m = '';
                this.model.propaddress_m = '';
            }
                break;
            case 'consolidateotherMortage':
                break;
            default: console.log("")
        }
    }
    AmountFormatter(amountvalue: any, var_v: any) {
        console.log("AmountFormatting");
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
        console.log("reverting");
        var tmpOldvalue;
        if (oldvalue != null && String(oldvalue).match(/\,/g)) {
            tmpOldvalue = oldvalue.replace(/\,/g, '');
            console.log(tmpOldvalue);
            this.model[var_v] = tmpOldvalue.substr(0, tmpOldvalue.length - 3);
            console.log(this.model[var_v]);
        }
    }
    emi(r) {
        var frequencytype;
        console.log(this.model.frequencyType);
        if (this.model.frequencyType == 'week') {
            frequencytype = 52;
        } else if (this.model.frequencyType == 'fortnight') {
            frequencytype = 26;
        } else {
            frequencytype = 12;
        }
        console.log(frequencytype);

        this.emiamount = this.totalamount;
        this.months = parseInt(this.model.loanterm) * frequencytype;
        console.log(this.months);
        console.log(this.model.loanterm);
        if (this.months <= 0) {
            return this.repaymentamount;
        }
        var rate = r / (12 * 100);
        // this.repaymentamount = Math.floor((this.emiamount * r *Math.pow((1+r),this.months))/(Math.pow((1+r),this.months)-1));
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 2,
        });


        this.repaymentamount = (Math.floor((this.emiamount * rate * Math.pow((1 + rate), this.months)) / (Math.pow((1 + rate), this.months) - 1))).toString();
        console.log(this.repaymentamount);

        if (this.model.repaymentAmount) {
            console.log("infinit");
        }
        return this.repaymentamount;
    }
    emirepay(r) {

        if ((!String(this.model.repaymentAmount).match(/\./g) || String(this.model.repaymentAmount).match(/\./g)) && String(this.model.repaymentAmount).match(/\,/g)) {
            var repaymentAmount = this.model.repaymentAmount.replace(/\,/g, "");
            this.model.repaymentAmount = repaymentAmount;
        }


        console.log(this.totalamount);
        console.log(this.model.repaymentAmount);
        this.emiamount = this.totalamount;
        console.log("rate", r)
       
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 2,
        });
                var frequencytype;
        console.log(this.model.frequencyType);
        if (this.model.frequencyType == 'week') {
            frequencytype = 52;
        } else if (this.model.frequencyType == 'fortnight') {
            frequencytype = 26;
        } else {
            frequencytype = 12;
        }
         var rate = r / ( 12*100);
        this.months = Math.log(parseInt(this.model.repaymentAmount)*(frequencytype/12) / (parseInt(this.model.repaymentAmount)*(frequencytype/12) - (this.emiamount * rate))) / Math.log(1 + rate);
        console.log(this.model.repaymentAmount);
        console.log("months", this.months);
        console.log("months", Math.floor(this.months));

        console.log(frequencytype);
        this.loanterm = (Math.floor(this.months / 12)).toString() + ' Years';
        console.log(this.loanterm);
        console.log((Math.floor(this.months / 12)).toString());
        if ((Math.floor(this.months / 12)).toString() == 'NaN') {
            console.log("not an number....");
            this.DisableFlag=true;
            this.loanterm = 'NA';
        }
        if ((Math.floor(this.months / 12)).toString() == '-Infinity Years') {
            console.log("not an number....");
            this.loanterm = 'NA';
            this.DisableFlag=true;
        }
        if ((Math.floor(this.months / 12)) > 30) {
            console.log("month is greater than 30");
            this.loanterm = 'NA';
            this.DisableFlag=true;
        }
        return this.model.repaymentAmount;
    }
    calculate() {
        this.DisableFlag=false;
        // this.availableProduct;
        console.log("calculate function");
        if ((!String(this.model.amtborrow).match(/\./g) || String(this.model.amtborrow).match(/\./g)) && String(this.model.amtborrow).match(/\,/g)) {
            //var amtborrow=this.model.amtborrow;
            var amtborrow =this.model.amtborrow.replace(/\,/g, "");
            console.log("amt",this.model.amtborrow);
            this.amtborrow = amtborrow;
            console.log("amt",this.amtborrow);
        }else{
            console.log("amtt",this.model.amtborrow);
            this.amtborrow = this.model.amtborrow;
            console.log("amt",this.amtborrow);
        }
        if (this.model.consolidateMortage == true) {
            if ((!String(this.model.estvalue).match(/\./g) || String(this.model.estvalue).match(/\./g)) && String(this.model.estvalue).match(/\,/g)) {
                var estvalue = this.model.estvalue.replace(/\,/g, "");
                this.model.estvalue = estvalue;
            }
            this.model.no_address_found_flag = this.no_address_found_flag;

            if (this.model.proppostcode_m != "" && this.model.proppostcode_m != null && this.model.proppostcode_m != '1234') {
                this.addrErr = false;
                if (this.no_address_found_flag == 'Y') {
                    // this.model.propaddress_m = this.model.propstreetnum_m + " " + this.model.propstreetname_m + " " + this.model.propsuburb_m + " " + this.model.propstate_m + " " + this.model.proppostcode_m;
                }

            }
        }
        if (this.model.consolidateotherMortage == true) {
            if ((!String(this.model.cc_estvalue).match(/\./g) || String(this.model.cc_estvalue).match(/\./g)) && String(this.model.cc_estvalue).match(/\,/g)) {
                var cc_estvalue = this.model.cc_estvalue.replace(/\,/g, "");
                this.model.cc_estvalue = cc_estvalue;
            }
            if ((!String(this.model.pl_estvalue).match(/\./g) || String(this.model.pl_estvalue).match(/\./g)) && String(this.model.pl_estvalue).match(/\,/g)) {
                var pl_estvalue = this.model.pl_estvalue.replace(/\,/g, "");
                this.model.pl_estvalue = pl_estvalue;
            }
            if ((!String(this.model.cl_estvalue).match(/\./g) || String(this.model.cl_estvalue).match(/\./g)) && String(this.model.cl_estvalue).match(/\,/g)) {
                var cl_estvalue = this.model.cl_estvalue.replace(/\,/g, "");
                this.model.cl_estvalue = cl_estvalue;
            }
            if ((!String(this.model.sl_estvalue).match(/\./g) || String(this.model.sl_estvalue).match(/\./g)) && String(this.model.sl_estvalue).match(/\,/g)) {
                var sl_estvalue = this.model.sl_estvalue.replace(/\,/g, "");
                this.model.sl_estvalue = sl_estvalue;
            }
            if ((!String(this.model.o_estvalue).match(/\./g) || String(this.model.o_estvalue).match(/\./g)) && String(this.model.o_estvalue).match(/\,/g)) {
                var o_estvalue = this.model.o_estvalue.replace(/\,/g, "");
                this.model.o_estvalue = o_estvalue;
            }

        }
        if (this.model.estvalue == null || this.model.estvalue == '')
        { this.estvalue_v = 0 }
        else { this.estvalue_v = parseInt(this.model.estvalue) }
        if (this.model.cc_estvalue == null || this.model.cc_estvalue == '')
        { this.cc_estvalue_v = 0 }
        else { this.cc_estvalue_v = parseInt(this.model.cc_estvalue) }
        if (this.model.pl_estvalue == null || this.model.pl_estvalue == '')
        { this.pl_estvalue_v = 0 }
        else { this.pl_estvalue_v = parseInt(this.model.pl_estvalue) }
        if (this.model.cl_estvalue == null || this.model.cl_estvalue == '')
        { this.cl_estvalue_v = 0 }
        else { this.cl_estvalue_v = parseInt(this.model.cl_estvalue) }
        if (this.model.sl_estvalue == null || this.model.sl_estvalue == '')
        { this.sl_estvalue_v = 0 }
        else { this.sl_estvalue_v = parseInt(this.model.sl_estvalue) }
        if (this.model.o_estvalue == null || this.model.o_estvalue == '')
        { this.o_estvalue_v = 0 }
        else { this.o_estvalue_v = parseInt(this.model.o_estvalue) }
        this.totalamount = parseInt(parseInt(this.amtborrow) + this.estvalue_v + this.cc_estvalue_v + this.pl_estvalue_v + this.cl_estvalue_v + this.sl_estvalue_v + this.o_estvalue_v);
        this.model.totalMortgage=this.totalamount;
        console.log("total",this.totalamount);
        console.log(this.TimeFlag);
        if (this.TimeFlag) {
            for (var i = 0; i < this.availableProduct.length; i++) {
                this.availableProduct[i].emi = this.emirepay(this.availableProduct[i].interest_rate);
                this.availableProduct[i].loanterm = this.loanterm;
                console.log("amount", this.availableProduct[i].emi);
                if (this.availableProduct[i].product_code == this.model.product_code) {
                    this.model.emi = this.availableProduct[i].emi;
                    this.model.interest_rate = this.availableProduct[i].interest_rate;
                    this.model.loanterm=this.availableProduct[i].loanterm;
                    this.model.establishment_fees = this.availableProduct[i].establishment_fees;
                    this.model.loan_service_fees = this.availableProduct[i].loan_service_fees;
                }
            } 
            }else {
                console.log(this.availableProduct.length)
                for (var i = 0; i < this.availableProduct.length; i++) {
                    this.availableProduct[i].emi = this.emi(this.availableProduct[i].interest_rate);
                    this.availableProduct[i].loanterm = this.model.loanterm;
                    console.log("time", this.availableProduct[i].emi);
                    if (this.availableProduct[i].product_code == this.model.product_code) {
                        this.model.emi = this.availableProduct[i].emi;
                        this.model.interest_rate = this.availableProduct[i].interest_rate;
                        this.model.establishment_fees = this.availableProduct[i].establishment_fees;
                        this.model.loan_service_fees = this.availableProduct[i].loan_service_fees;
                    }
                }
            }


    }
    Switchproduct(productcode, productname) {
        console.log("switching product", productname, productcode);
        this.model.product_name = productname;
        this.model.product_code = productcode;
        console.log("switching product", this.model.product_name, this.model.product_code = productcode);
        this.calculate();
    }
    Toggle(flag) {
        console.log(this.TimeFlag);
        this.TimeFlag = flag;
        console.log(this.TimeFlag);
        this.calculate();
        if(this.TimeFlag){
            this.model.loanterm='0'
        }else{
            this.model.repaymentAmount='0';
        }
    }
}