

const TemplateReplace=(template,data)=>{
    var output=template.replace(/{%USERNAME%}/g,data.username)
    output=output.replace(/{%EMAIL%}/g,data.email)
    output=output.replace(/{%PASSWORD%}/g,data.password)

    return output
}

module.exports=TemplateReplace