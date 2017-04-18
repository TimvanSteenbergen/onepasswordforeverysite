/**
 * Created by tvansteenbergen on 2017-03-09.
 *
 * This is what I do every time you visit any page:
 * - I check if this site allows you to log on.
 * - If not: I do nothing
 * - If so: I check in your userData if you have logged in to this site before.
 * -        If not: You need to log in the old-fashioned way, change your password with my help and log in again.
 * -        If so: I retrieve your userid for this site and copy the value to the user-id's inputfield.
 * -               I add my own version of the password-field
 * -               I put your userid, that you have used before on this site, in the user-id's inputfield
 *
 * Abstract factory Typescript-style see https://github.com/torokmark/design_patterns_in_typescript/blob/master/abstract_factory
 */

// namespace PasswordFormAbstractFactory {
//     export interface PasswordFormLogin {
//         methodA(): string;
//     }
//     export interface PasswordFormChange {
//         methodB(): number;
//     }
//
//     export interface AbstractFactory {
//         createProductA(param?: any) : AbstractProductA;
//         createProductB() : AbstractProductB;
//     }
//
//
//     export class ProductA1 implements AbstractProductA {
//         methodA = () => {
//             return "This is methodA of ProductA1";
//         }
//     }
//     export class ProductB1 implements AbstractProductB {
//         methodB = () => {
//             return 1;
//         }
//     }
//
//     export class ProductA2 implements AbstractProductA {
//         methodA = () => {
//             return "This is methodA of ProductA2";
//         }
//     }
//     export class ProductB2 implements AbstractProductB {
//         methodB = () => {
//             return 2;
//         }
//     }
//
//
//     export class LoginFormFactory implements AbstractFactory {
//         createOneUseridOnePassword(param?: any) : AbstractProductA {
//             return new ProductA1();
//         }
//
//         createWeirdVariantA(param?: any) : AbstractProductB {
//             return new ProductB1();
//         }
//     }
//     export class ConcreteFactoryChangePasswordForm implements AbstractFactory {
//         createProductA(param?: any) : AbstractProductA {
//             return new ProductA2();
//         }
//
//         createProductB(param?: any) : AbstractProductB {
//             return new ProductB2();
//         }
//     }
//
//
//     export class Tester {
//         private abstractProductA: AbstractProductA;
//         private abstractProductB: AbstractProductB;
//
//         constructor(factory: AbstractFactory) {
//             this.abstractProductA = factory.createProductA();
//             this.abstractProductB = factory.createProductB();
//         }
//
//         public test(): void {
//             console.log(this.abstractProductA.methodA());
//             console.log(this.abstractProductB.methodB());
//         }
//     }
//
// }