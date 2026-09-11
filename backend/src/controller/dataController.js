const InsuranceForm = require('../models/data.js')

// CREATE INSURANCE FORM
// POST /api/insurance

exports.createInsuranceForm = async (req ,res) =>{
    try{
        const formData = { ...req.body };
        if (formData.createdAt) {
          formData.createdAt = new Date(formData.createdAt);
        }
        const insuranceForm = await InsuranceForm.create(formData);
        res.status(201).json({
            success : true,
            message : "Insurance form is created successfully ",
            data : insuranceForm
        });
    }catch(error){
        console.log("Error at creation of form",error);
        res.status(500).json({
            success : false,
            message : "Error at creation of form",
            error : error.message
        });
    }
}

const getYearlyMultiplier = (mode) => {
    if (!mode) return 1;
    const m = String(mode).trim().toLowerCase();
    if (m.includes("half")) return 2;
    if (m.includes("quarter")) return 4;
    if (m.includes("month")) return 12;
    return 1;
};

//Get all insurances of agent 
//GET /api/insurance

exports.getAllInsuranceForms = async (req , res) =>{
    try{
        const { search, year } = req.query;
        let queryConditions = [];

        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), "i");
            const searchNumber = Number(search.trim());
            
            const orConditions = [
                { "section1.fullName": searchRegex },
                { "section1.cellNumber": searchRegex },
                { "agentDetails.agentName": searchRegex },
                { "agentDetails.agentCode": searchRegex },
                { "section2.email": searchRegex },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: "$section7.policyNo" },
                            regex: search.trim(),
                            options: "i"
                        }
                    }
                }
            ];

            if (!isNaN(searchNumber) && searchNumber > 0) {
                orConditions.push({ "section7.policyNo": searchNumber });
            }

            queryConditions.push({ $or: orConditions });
        }

        if (year && year !== "all") {
            const parsedYear = Number(year);
            if (!isNaN(parsedYear) && parsedYear > 1900) {
                const startDate = new Date(Date.UTC(parsedYear, 0, 1, 0, 0, 0, 0));
                const endDate = new Date(Date.UTC(parsedYear, 11, 31, 23, 59, 59, 999));
                queryConditions.push({
                    createdAt: { $gte: startDate, $lte: endDate }
                });
            }
        }

        const query = queryConditions.length > 0 ? { $and: queryConditions } : {};

        const forms = await InsuranceForm.find(query)
            .sort({ createdAt : -1 });

        // Calculate summary statistics across all matching forms
        const totalSumAssured = forms.reduce((acc, f) => acc + (Number(f.section7?.insuranceAmount) || 0), 0);
        const totalPremiumAmount = forms.reduce((acc, f) => acc + (Number(f.section7?.premiumAmount) || 0), 0);
        const totalYearlyPremium = forms.reduce((acc, f) => {
            const prem = Number(f.section7?.premiumAmount) || 0;
            const mult = getYearlyMultiplier(f.section7?.paymentMode);
            return acc + (prem * mult);
        }, 0);

        // Fetch distinct creation years across all forms for the dropdown filter
        const allFormsDates = await InsuranceForm.find({}, "createdAt");
        const availableYearsSet = new Set(
            allFormsDates
                .map((f) => f.createdAt ? new Date(f.createdAt).getFullYear() : null)
                .filter(Boolean)
        );
        const currentYear = new Date().getFullYear();
        availableYearsSet.add(currentYear);
        const availableYears = Array.from(availableYearsSet).sort((a, b) => b - a);

        res.status(200).json({
            success : true,
            message : "Insurances fetched successfully",
            count : forms.length,
            stats: {
                totalForms: forms.length,
                totalSumAssured,
                totalPremiumAmount,
                totalYearlyPremium
            },
            availableYears,
            data : forms,
        })
    }catch(error){
        console.log("Error formed by getting the insurances",error);
        res.status(500).json({
            success : false,
            message : "Failed to fetch the data",
            error : error.message,
        })
    }
}

//getting one insurance
//GET /api/insurance/:id

exports.getInsurance = async (req, res)=>{
    try{
        const {id} = req.params;
        const form = await InsuranceForm.findById(id);

        if(!form){
            return res.status(404).json({
                success : false,
                message : "Insurance form is not found"
            })
        }

        res.status(200).json({
            success : true,
            data : form,
        })
    }catch(error){
        console.log("error formed by getting the insurance")
        res.status(500).json({
            success : false,
            message : "Failed to fetch the insurance",
            error : error.message,
        })
    }
}

//Update the insurance
// PUT /api/insurance/:id

exports.updateInsuranceForm = async (req, res) =>{
    try{
        const {id} = req.params;
        const updateData = { ...req.body };
        if (updateData.createdAt) {
          updateData.createdAt = new Date(updateData.createdAt);
        }
        const updatedForm = await InsuranceForm.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        )

        if(!updatedForm){
            return res.status(404).json({
                success: false,
                message: "Insurance was not found",
            })
        }

        res.status(200).json({
        success: true,
        message: "Insurance form updated successfully",
        data: updatedForm,
        });

    }catch(error){
        console.log("Error was found during updating the insurance",error);
        res.status(500).json({
            success : false,
            message : "Failed to update the insurance",
            error : error.message,
        })
    }
}

// DELETE INSURANCE FORM
// DELETE /api/insurance/:id

exports.deleteInsuranceForm = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedForm = await InsuranceForm.findByIdAndDelete(id);

    if (!deletedForm) {
      return res.status(404).json({
        success: false,
        message: "Insurance form not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Insurance form deleted successfully",
    });
  } catch (error) {
    console.error("Delete Insurance Form Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete insurance form",
      error: error.message,
    });
  }
};