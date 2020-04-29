import {Joiner} from "./joiner";

const parseSpecValue = function (specs) {
    if(!specs){
        return null
    }
    const joiner = new Joiner('; ', 2)
    specs.map(spec=>{
        joiner.join(spec.value)
    })
    return joiner.getStr()
}

const parseSpecValueArray = function (values) {
    if(!values){
        return null;
    }
    const joiner = new Joiner('; ', 2)
    values.map(v=>{
        joiner.join(v)
    })
    return joiner.getStr()
}

export {
    parseSpecValue,
    parseSpecValueArray
}
