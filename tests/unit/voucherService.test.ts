import voucherService from "services/voucherService";
import voucherRepository from "repositories/voucherRepository";
import {jest} from '@jest/globals'

function generateCode() {
    let randomCode = 'a0';
    let caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 9; i++) {
        randomCode += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return randomCode;
}

function generateDiscount(){
    return Math.floor(Math.random() * 100) + 1;
}

const voucher = {
    code: generateCode(),
    discount: generateDiscount()
}

describe("Create voucher unit test suite", () => {    

    it("should create a valid voucher", async () => {     
        expect( async () => {jest
            .spyOn(voucherRepository, "getVoucherByCode")
            .mockImplementationOnce((): any => {return ""});  

        jest
            .spyOn(voucherRepository, "createVoucher")
            .mockImplementationOnce((): any => {return voucher});

        await voucherService.createVoucher(voucher.code, voucher.discount)
    }).not.toEqual({message: "Voucher already exist.", type: "conflict"});
    });

    it("should respond with 'Voucher already exist.' ",  () => {
        expect( async () => {
        const voucher = {
            code: generateCode(),
            discount: generateDiscount()           
        }

        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {return [voucher]});

        const promise = await voucherService.createVoucher(voucher.code, voucher.discount);
        }).rejects.toBeInstanceOf({message: "Voucher already exist.", type: "conflict"});
    }); 
})

// describe("Apply voucher unit test suite", () => {
// // it("should apply the voucher", async () => {
// //     const voucher = {code: generateCode(),discount: generateDiscount(),  used: false};
// //     const usedVoucher = {...voucher, used: true}
// //     const amount = 152;
// //     const finalAmount = amount - (amount * (voucher.discount / 100));

// //     jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {return [voucher]});
// //     jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce((): any => {return [usedVoucher]});

// //     const result = await voucherService.applyVoucher(voucher.code, amount);

// //     console.log(result)
///
// //     let expectedResult = {
// //         amount: amount,
// //         discount: voucher.discount,
// //         finalAmount: finalAmount,
// //         applied: finalAmount !== amount
// //     }

// //     expect(result).toBe(expectedResult);
// // });

// // it("should respond with 'Voucher does not exist.' ", () => {

// // });

// // it("amount is invalid for discount", () => {

// // });
// // it("voucher is already used", () => {

// // });
// })
