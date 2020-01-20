

const templateReplace=(template,product)=>{
    var output=template.replace(/{%USERNAME%}/g,product.username)
    output=output.replace(/{%EMAIL%}/g,product.email)
    output=output.replace(/{%PASSWORD%}/g,product.password)

    return output
}

module.exports=templateReplace