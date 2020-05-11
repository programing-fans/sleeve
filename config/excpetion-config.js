const behavior={
    throw_server_error: true
}

const codes =  {
    "-1": "网络中断、超时或其他异常",
    999: '抱歉，server_error',
    777: '抱歉，no_codes',
    30001:'优惠券没找到',
    40006:'您已经领取过该优惠券',
}

export {
    codes,
    behavior
}
