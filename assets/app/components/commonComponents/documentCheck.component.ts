import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { OAOService } from "../../services/OAO.Service";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";

@Component({
    selector: 'document-check',
    templateUrl: './documentCheck.component.html'
})
export class DocumentCheck implements OnInit {


    private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
    private isLoading: boolean = false;

    constructor(private oaoservice: OAOService, private router: Router, private route: ActivatedRoute) {
        this.model = this.oaoservice.getPersonalDetailsObject();
    }
    ngOnInit() {

    }

    /**Set Document Check */
    setDocumentCheck(is_doc_upload: boolean) {
        this.model.is_doc_upload = is_doc_upload;

        if (is_doc_upload) {

            if (this.model.app_id || this.model.application_id) {

                this.router.navigate(['../drivingLicenseInfo'], { relativeTo: this.route });
                return;
            }
            this.isLoading = true;
            this.oaoservice.generateApplicationID().subscribe(res => {
                if (!res.error) {
                    console.log('generated app id ', res.data);
                    this.model.app_id = res.data;

                    this.oaoservice.setPersonalDetailsObject(this.model);
                }
                else {
                    console.log('Error ocurred while generating app id', res.error);
                }
                this.isLoading = false;

                this.router.navigate(['../drivingLicenseInfo'], { relativeTo: this.route });
            });
        } else {
            this.router.navigate(['../personalBasicInfo'], { relativeTo: this.route });
        }
    }

  


}