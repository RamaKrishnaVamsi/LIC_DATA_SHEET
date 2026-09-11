const mongoose =require("mongoose");

const Schema = mongoose.Schema;

const insuranceFormSchema = new Schema(
  {
    // =========================================================
    // TOP SECTION - Agent / LIC representative information
    // =========================================================

    agentDetails: {
      agentName: {
        type: String,
        trim: true,
      },

      agentPhone: {
        type: String,
        trim: true,
      },

      agentCode: {
        type: String,
        trim: true,
      },
    },

    // =========================================================
    // 1.
    // Full Name + Cell Number
    // =========================================================

    section1: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      cellNumber: {
        type: String,
        trim: true,
      },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
      },

      age: {
        type: Number,
        min: 0,
        max: 120,
      },
    },

    // =========================================================
    // 2. 
    // Full Address + Email ID + Spouse Address
    // =========================================================

    section2: {
      fullAddress: {
        type: String,
        trim: true,
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
      },

      spouseAddress: {
        type: String,
        trim: true,
      },
    },

    // =========================================================
    // 3. 
    // Father's Full Name + Mother's Full Name + Husband's Full Name
    // =========================================================

    section3: {
      fatherFullName: {
        type: String,
        trim: true,
      },

      motherFullName: {
        type: String,
        trim: true,
      },

      husbandFullName: {
        type: String,
        trim: true,
      },
    },

    // =========================================================
    // 4. 
    // Occupation Details
    // =========================================================

    section4: {
      occupationDetails: {
        type: String,
        trim: true,
      },
    },

    // =========================================================
    // 5. 
    // Employer / Organization Name + Address
    // =========================================================

    section5: {
      organizationName: {
        type: String,
        trim: true,
      },

      organizationAddress: {
        type: String,
        trim: true,
      },
    },

    // =========================================================
    // 6. 
    //    S.R.No./Tax No.
    // =========================================================

    section6: {
      monthlyIncome: {
        type: Number,
        min: 0,
      },

      completedService: {
        type: Number,
        min : 0,
      },

      srNumberOrTaxNumber: {
        type: String,
        trim: true,
      },
    },

    // =========================================================
    // 7. policyNo -insuranceAmt - paymentMode
    // =========================================================

    section7: {
      policyNo : {
        type: Number, 
      },
      insuranceAmount: {
        type: Number,
        min: 0,
      },

      premiumAmount: {
        type: Number,
        min: 0,
      },

      paymentMode: {
        type: String,
        trim: true,
      },
    },

    // =========================================================
    // 8. 
    // Date of Birth + Age + Place of Birth
    // =========================================================

    section8: {
      dateOfBirth: {
        type: Date,
      },

      age: {
        type: Number,
        min: 0,
        max: 120,
      },

      placeOfBirth: {
        type: String,
        trim: true,
      },
    },

    // =========================================================
    // 9. 
    // Educational Qualifications + Aadhaar Number
    // =========================================================

    section9: {
      educationalQualification: {
        type: String,
        trim: true,
      },

      aadhaarNumber: {
        type: String,
        trim: true,
      },
    },

    // =========================================================
    // 10. 
    // Nominee Full Name + Age + Relationship
    // =========================================================

    section10: {
      nomineeFullName: {
        type: String,
        trim: true,
      },

      nomineeAge: {
        type: Number,
        min: 0,
        max: 120,
      },

      nomineeRelationship: {
        type: String,
        trim: true,
      },
    },

    // =========================================================
    // 11. 
    // Appointee Full Name + Age + Relationship with Nominee
    // =========================================================

    section11: {
      appointeeFullName: {
        type: String,
        trim: true,
      },

      appointeeAge: {
        type: Number,
        min: 0,
        max: 120,
      },

      appointeeRelationshipWithNominee: {
        type: String,
        trim: true,
      },
    },

    // =========================================================
    // 12. 
    // Height in CM + Weight
    // =========================================================

    section12: {
      heightCm: {
        type: Number,
        min: 0,
      },

      weightKg: {
        type: Number,
        min: 0,
      },
    },

    // =========================================================
    // 13. 
    // Identifying / Birth Marks - 1 and 2
    // =========================================================

    section13: {
      mark1: {
        type: String,
        trim: true,
      },

      mark2: {
        type: String,
        trim: true,
      },
    },

    // =========================================================
    // 14. 
    // Health / Disability - Complete Details
    // =========================================================

    section14: {
      healthDisabilityDetails: {
        type: String,
        trim: true,
      },
    },

    // =========================================================
    // 15. BANK DETAILS
    // Bank A/c No. + IFSC + Bank Name + Bank Address
    // =========================================================

    section15: {
      bankAccountNumber: {
        type: String,
        trim: true,
      },

      ifscCode: {
        type: String,
        trim: true,
        uppercase: true,
      },

      bankName: {
        type: String,
        trim: true,
      },

      bankAddress: {
        type: String,
        trim: true,
      },
    },

    // =========================================================
    // 16. 
    // Family History
    //
    // Rows visible in form:
    //  - Father- Mother - Brothers - Sisters- Wife's side relative - Children
    // Right side contains information regarding deceased
    // family members, including cause of death and age.
    // =========================================================

    section16: {
      familyHistory: [
        {
          relationship: {
            type: String,
            trim: true,
          },

          phoneNumber: {
            type: String,
            trim: true,
          },

          // Whether the family member is living
          isAlive: {
            type: Boolean,
          },

          // Details of living member
          livingDetails: {
            type: String,
            trim: true,
          },

          // If deceased
          causeOfDeath: {
            type: String,
            trim: true,
          },

          ageAtDeath: {
            type: Number,
            min: 0,
          },
        },
      ],
    },

    // Document attachments
    documents: [
      {
        fileName: {
          type: String,
          trim: true,
        },
        fileCategory: {
          type: String,
          trim: true,
        },
        fileData: {
          type: String,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // =========================================================
    // 17.  Details of Existing / Previous Policies
    //
    // Columns:
    // Policy Number
    // Policy Holder
    // D & D
    // Sum Assured
    // Policy issuing institution
    // Mode
    // Whether active
    // =========================================================

    section17: {
      previousPolicies: [
        {
          policyNumber: {
            type: String,
            trim: true,
          },

          policyHolderName: {
            type: String,
            trim: true,
          },

          dAndD: {
            type: String,
            trim: true,
          },

          sumAssured: {
            type: Number,
            min: 0,
          },

          policyIssuingInstitution: {
            type: String,
            trim: true,
          },

          mode: {
            type: String,
            trim: true,
          },

          isActive: {
            type: Boolean,
          },
        },
      ],
    },

    // =========================================================
    // 18. 
    //
    // Husband details + husband's policies
    // =========================================================

    section18: {
      husbandName: {
        type: String,
        trim: true,
      },

      husbandOccupation: {
        type: String,
        trim: true,
      },

      husbandMonthlyIncome: {
        type: Number,
        min: 0,
      },

      lastDeliveryDate: {
        type: Date,
      },

      // Husband's existing policies
      husbandPolicies: [
        {
          policyNumber: {
            type: String,
            trim: true,
          },

          branch: {
            type: String,
            trim: true,
          },

          sumAssured: {
            type: Number,
            min: 0,
          },

          tAndT: {
            type: String,
            trim: true,
          },

          isActive: {
            type: Boolean,
          },
        },
      ],
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "InsuranceForm",
  insuranceFormSchema
);

// export default InsuranceForm;