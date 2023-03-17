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

    it("should create a valid voucher", () => {     
        expect( async () => {
        
        jest
            .spyOn(voucherRepository, "getVoucherByCode")
            .mockImplementationOnce((): any => {return ""});  

        jest
            .spyOn(voucherRepository, "createVoucher")
            .mockImplementationOnce((): any => {return voucher});

        await voucherService.createVoucher(voucher.code, voucher.discount)

        }).not.toEqual({message: "Voucher already exist.", type: "conflict"});
    });

    it("should respond with 'Voucher already exist.'", () => {
        expect( async () => {
        const voucher = {
            code: generateCode(),
            discount: generateDiscount()           
        }

        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {return [voucher]});

        await voucherService.createVoucher(voucher.code, voucher.discount);
        }).rejects.toBeInstanceOf({message: "Voucher already exist.", type: "conflict"});
    }); 
})

describe("Apply voucher unit test suite", () => {

    it("should apply the voucher", async () => {
        
    jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockImplementationOnce((): any => {
            return {
                id: 1,
                code: voucher.code,
                discount: voucher.discount,
                used: false
            };
        });

    jest
        .spyOn(voucherRepository, "useVoucher")
        .mockImplementationOnce((): any => {return});
    
    const response = await voucherService.applyVoucher(voucher.code, 100);
     
    const expectedResult = {
         amount: 100,
         discount: voucher.discount,
         finalAmount: 100 - (100 * (voucher.discount / 100)),
         applied: true
    };

     expect(response).toEqual(expectedResult);
    });

    it("should respond with 'Voucher does not exist.'", async () => {

        jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockImplementationOnce((): any => {
            return false;
        });

        const response = voucherService.applyVoucher(voucher.code, 100);
        expect(response).rejects.toEqual({message: "Voucher does not exist.", type: "conflict"})
    });
   
   it("the minimun amount is invalid for discount", async () => {

    jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockImplementationOnce((): any => {
            return {
                id: 1,
                code: voucher.code,
                discount: voucher.discount,
                used: false
            };
        });

    jest
        .spyOn(voucherRepository, "useVoucher")
        .mockImplementationOnce((): any => {return});
    
    const response = await voucherService.applyVoucher(voucher.code, 99);
     
    let expectedResult = {
         amount: 99,
         discount: voucher.discount,
         finalAmount: 99,
         applied: false
    };

     expect(response).toEqual(expectedResult);
    });   

    it("the voucher is already used", async () => {
        
        jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockImplementationOnce((): any => {
            return {
                id: 1,
                code: voucher.code,
                discount: voucher.discount,
                used: true
            };
        });

    jest
        .spyOn(voucherRepository, "useVoucher")
        .mockImplementationOnce((): any => {return});
    
    const response = await voucherService.applyVoucher(voucher.code, 100);
     
    let expectedResult = {
         amount: 100,
         discount: voucher.discount,
         finalAmount: 100,
         applied: false
    };

     expect(response).toEqual(expectedResult);    

    });
 
});
