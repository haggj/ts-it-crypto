import { UserManagement } from '../user/user';
import { exampleAccessLog, TestKeys } from './utils';
import { EncryptionService } from '../crypto/encryption';
import { createFetchSender } from '../utils/fetchSender';
import { DecryptionService } from '../crypto/decryption';

const goDecryptB =
  '{"protected":"eyJhbGciOiJFQ0RILUVTK0EyNTZLVyIsImVuYyI6IkEyNTZHQ00iLCJlcGsiOnsia3R5IjoiRUMiLCJjcnYiOiJQLTI1NiIsIngiOiJpeHdsY24zdFFQakJnY2JoU0JmMWJHaE5ZalV0ckJwZTNzdkNaUGJsTV9BIiwieSI6Im1HdWVPaTBwQUc1aThLME5VTmdHT2xhTm1HeFFtQVFDMmxNYktoS1lUbmcifSwic2hhcmVkSGVhZGVyIjp7InBheWxvYWQiOiJleUp6YUdGeVpVbGtJam9pTldObVl6STNNV0l0WkdJeE1TMDBOREEzTFRnME56TXRNRGxqTVRFME5ERXlZemRpSWl3aWIzZHVaWElpT2lKeVpXTmxhWFpsY2lJc0luSmxZMlZwZG1WeWN5STZXeUp5WldObGFYWmxjaUpkZlEiLCJwcm90ZWN0ZWQiOiJleUpoYkdjaU9pSkZVekkxTmlKOSIsInNpZ25hdHVyZSI6IlBGOTVwOHMwQVNOYkVSS3hncExSWE5WUUdHb1Jwak92UXIzQ3RZdmN0aUhDYmZOcmM1RmQ5SFpHcmFiczRrWWdhTWtFOG0zTDVLakotRGNxNnFUVnJ3In19","encrypted_key":"tGgz8UpMQiKGer3vJGh8fLnWvx9nYL2ZGJjR-D6Peo6Oz7EkVG53mQ","iv":"0AMTbgJrnoGYuLaA","ciphertext":"hCQT-2dat2PDRBHxw9xsMPf_X5HW-quewB7fawipIUbr7lHNnEMiMyDxiEvmR_sJe_MtiEv7pYg1fAgMmwHh8yGWv23fyQG7g-g1cSC2vG5ArgSDloe4EcOoMkvGxv1hSq3vMI_UNf0VQyqQu5JbeZTWPH0wVAsyVckkEf-5wpS7SH1h8GYGtsLpgF7FhjigBJSvfqwp-yYOiUkqclhYTebIz1gnlcFTHCioX9VwQkeVt5OLqfXi5dgyx1YPHTDNowmr_d9J_-Obn-k4JGPvBXaazIYtfgzBO8b23srNMSsFJhhtE6dADhPHWPZO94Swg4XJNhz884raNCw3J1-p5odlhAsp6Kw4Q7a4VZvVNX2u0k-JNrN4YRqGn_DB1noHnWfAkf6-0-6Jqi_9Sewdj48avGly0M1NRAwigoN7gpMCHepaNbdDiJqHSEEFh10H55ZxX_tgUtdHwrBj89otPtU8mveTDfR7u-JwugwzD2DV76vc96GW_pTLWP9QDOhA9ACkqCVlHPyefSWFNOhaT0IOK7SUFtYjZuzfUVP_eI6SVZBXGk_PEo64puHfhfbhwfmBv1A22BITmkIW1FzSDAI6T05ZryEAyfYjVOd-WXzIUjy2MqRBN-Y6EwuUui7fUKHx02hZek1CnZmo2lbAUk9zMJOMLcmhyVryWsVy8eftIqThHK5X8QNnB7ojlv1Dq_hLQxp0SGIR-q_ga9eqvj_5oU63_s2Pane-yBDkavzUZH9o4PgYOcrm4ouAs1pTuYeqdLMpJVQLckseXxz8A5sIw7SJ5dRbI_wZ3gN16ODTl5U8bxEvPGN4f4BJiXYRiakpwogBESVdECEQIYYUduPxSOQKkOZaBr6hCx4JtbERgHJj5vs_5TsI10LJt_xByvKkslzfGyvvYXspbdQLUsXCTEUntPygdAseDOtro3mwYxf8m9KGcSR1zdy8BSHa8NRqoZMn1Xk","tag":"-FqAT10fjTSxJupw6Wy3xw"}';

const goDecryptAB =
  '{"protected":"eyJlbmMiOiJBMjU2R0NNIiwic2hhcmVkSGVhZGVyIjp7InBheWxvYWQiOiJleUp6YUdGeVpVbGtJam9pWTJFek16SmpNVGd0TnpCbE9DMDBNVFl4TFRrNFpqWXRNMkl4TjJFeE5EQTNPRFl4SWl3aWIzZHVaWElpT2lKeVpXTmxhWFpsY2lJc0luSmxZMlZwZG1WeWN5STZXeUp5WldObGFYWmxjaUlzSW5ObGJtUmxjaUpkZlEiLCJwcm90ZWN0ZWQiOiJleUpoYkdjaU9pSkZVekkxTmlKOSIsInNpZ25hdHVyZSI6ImphVUZ2cWxaVmtwSnp5Z0xkS3JxNHM5VEJSZE5DQUlHSjNBcjRzc0dpVm5QTklsWG1OZ0JqQXZGaExydmptUV9wS3hCbmszZ05FUkpULVQzdDBLX0ZnIn19","recipients":[{"header":{"alg":"ECDH-ES+A256KW","epk":{"kty":"EC","crv":"P-256","x":"aD-XXwe5BVZOnsB8G4u0Or_E3_bxR0TSWORAKezaRwo","y":"x7nhjxUmlbSK2N6uBOKKWDRYiBSbKtfUjIu_rscoDOA"}},"encrypted_key":"OpRu1mbwqXvXlKtl7m7pAKaoNlN20ow73mBPorqSgf50rsASSJsaFA"},{"header":{"alg":"ECDH-ES+A256KW","epk":{"kty":"EC","crv":"P-256","x":"wl1tneiCrj6gMq-1cAZ1WvxWCO8YG9uUpGlLAEKn72Q","y":"zB5LxIZqK5FNX8Tem8YCr93nRojd7kKeGWIaqlmBL7g"}},"encrypted_key":"fWBeM0RERw6wtZEfCPvx80ytQlmVQHCuxYfXhfbolpyvQHopzu3csQ"}],"encrypted_key":"OpRu1mbwqXvXlKtl7m7pAKaoNlN20ow73mBPorqSgf50rsASSJsaFA","iv":"YcKsOU0QWozaTuei","ciphertext":"Py8w6a8K4yr-4RbDprAuB8vNw2Cn86MChIlc6erc0TdN_9ceFaSYcgv9iDDd1rhJV-_8JMzGC6v5sDPsdpk3vQzp8gpJ4CBKFsJzQ-07NnkU5xgWCl-PEZsDxN6mAOEhx0beWMPqqH9U4nblOsX5RxeTIvzMkp7WvAMDk9TQqynns0-PsyEkKl5OWo3JZ3ziKqCKaBEPAj_KTSuJpB6xLGWdJnEq8XUhV4ZtdhY0IxA0ASmEz6FyBcMtU_4X8OR3rZNzHwW2SquVfil0OIts_blmdITw15CQwy8o-4xD7myierIVjQsBy3DarR8eh8ztGLg3YrWuGS5WFdVQLVtYPRLpgnvS48lJXGWDu2Ih843x89PYixljkZ7j3VtXx-ATO9DBby84ty8bm7gHctnvzBXgWsX3ICa_Sd4w9nvmynLewyOJt6JGhYtpGgMOYZDw9gpfwcqixynoOalt4_f-LUq9jB0juPawe60fXJeg-FlyiKrwmcqsbZaggqru_7Y7RCRfeikv0G3mjoyciw1xQSTkJxEr0QjLAOv7K3VZw-Hf19O1R7xSUFfacmXF5zwmIRGtY0HgSOl0BfU9W6mbNPF2WkKG1dWjY2FoA8M1N3ssn8YHqD15R97yOUPLpMWjjMi9mDRMyyA0S8oV9R8YF9Ab3eCKLwWQuG2plcQeWILom1lFLC_HYAyF1cuK1NNuOpq8XeCbQh1MwFmeM3QRhLx2ZjdcvqeMWixtFdz6VaSCFU5nFrgd3ij9fi8dqjSyY6uhq-_yXu57ZJLN1nD7BMLQKZkRRB14AV4Q3MmNKAzVRBobVbCgXIfU394icOH6FUhn2f-f3IJsQi0vZMBToy50URH10amuCaYrx9YoW7rE4nCJwMVEqZPLwsi3jtywcdf7KWmrpH-ZvX9GI1w6NrsqliLMmGEawuVKfGu6_UNv6wSY19MFlsBcWH1lzfg3eb10N4ccZq_fNQ","tag":"t2On3Qv0DM6eERomt0Q9ew"}';

const pythonDecryptB =
  '{"ciphertext":"NIFn5k9zrVpD7iRRTrbPBU0fC1k33rBVHm_fafCHyuOEkB9aiJF50Y318U-oKFBZ49Ufpu5vfTrwWbNj_jmcShBkdYXNYg8-ehVqku_I0LAaa3EBinf7K81cFGvRmHfePCbQLw3ku2SByIuFn0lpf5-DIkY8vJarThbuB4Dlh0qfEfTLoPSQo5_sU8T03CogxYfCD5PGjRe-qbNXRefg831YAJAHjavt8KndRxALGSGqhwR0EXeH4SGexazaSFJRNW15v3cGNg-Pw8pSI_r-cMO9Ve-gzS8kMpjz8Voo-GVkRUSyz3GvsG76GXXuUfwUMVjmFTGNl_M6cJXEbQMg2BCDLBL9eczWbIMyGr_6Jowjv2oDVOT3YbuH9LqZuydC0oGHj1oWoyqahKfEWzpA-SgRcTmAXHlOpaB_fNrSNGMuC5Hni0BLBKEWIdRAc0gwS4MqonGuPhD_CLB6OXjT_PAC-s96B2n-sLp2RAbY6syp_6sTQ2rTmYaf4pX3zpLVvffogkTgn7ghU43Mn76a1PAxVqwbxZeoUZSg5HPK7G416SKaETb015YlLY9U70bbu5m0mzLK1nt--kkgjQWVEfBtoFW_5JYL8-pKEdSGA4B1JRrK26GOLlbhivKXLyVvYbfw84TYfUUQQ79ZRmmRr3kWAmO1vzC063ljG1O-rv3_XOQ8WC-Cyw0koq77T9gvmRFFeDdYHNCs-rl2CQopZAzuCb4pS8o09cY6Xcsd3yWvL7qtVA_7Mce9mdJCUVMaPjdaa5szNvLDJ1VolvYNfJOt6Dh2NRxArU7AsV-8C0n4_CxVMsCjIrk23baYEQd9GOsE4zlz9c3ICdF_vRIc8T0aBr2xotSGdbbVG6wzA1FvwQifXG8jOX5av3rd3k-NXj07w8HEAPGtdkg4I_iFsJTnd9MRJbX5e010Q7QI875MJuHXr-A6nEiMIkpS_vEH0WOt_WUw","encrypted_key":"cFsAds8n7OkX71nAjY6hv7s_WmaFtT4-imMzW_Hzlgip27kAGXvbfg","header":{"epk":{"crv":"P-256","kty":"EC","x":"65XKDRaIyrljgOpouh09KQhWGXJTX27B85zD6-ju8kQ","y":"Cj2dg-BQQo1X_BPoQujdjlrBiEPRj15z0_xHLr_r6Ww"}},"iv":"FDzH68dzflzHj8RB","protected":"eyJhbGciOiJFQ0RILUVTK0EyNTZLVyIsImVuYyI6IkEyNTZHQ00iLCJzaGFyZWRIZWFkZXIiOnsicGF5bG9hZCI6ImV5SnphR0Z5WlVsa0lqb2lNREkxT0dVek5EWXRabVV5WlMwME1qVmpMV0ZrWXpJdE1XTTFaV000WmpObE16WmpJaXdpYjNkdVpYSWlPaUp5WldObGFYWmxjaUlzSW5KbFkyVnBkbVZ5Y3lJNld5SnlaV05sYVhabGNpSmRmUSIsInByb3RlY3RlZCI6ImV5SmhiR2NpT2lKRlV6STFOaUo5Iiwic2lnbmF0dXJlIjoiZm1GVjhLckJPV1djQzZ0Q1pMTVRUQjNEV0ZydXJLdk1JUTd1bWN6MTI0UFY3cjJ6Y0tuRXlpYUtJVlFDVEdCa250UThDYXJib3U0MjdFblB4aFYwSncifX0","tag":"kKU2-GYlnw9iQh8d33nOpA"}';

const pythonDecryptAB =
  '{"ciphertext":"CzBFfVHH223qfPTmYAVTHW167o-zyI9yez8wL7b_aU803qdEZxwNWF7gh6p3NJDZL4YoKAOvO9nT6mYYPMNRy_Ef4plvtlbCa271-epr6STK9pxoaSazNaWIAevgVrRHrXtaxekENrajh2Zu8pDcP0ag8PZNjWFtWWcEyF4XQsmbcC6TqUs0Jfq-ylLSla8LJdJ_UBuvnHqQ4cd5Jt_Ix6Xqr1enCSEzjvHYp84W4JydY1spTGVlqJMVJ3o_AmxCPGFXd9M7FcKWoaq4ENGmDkVzmfqdDLPOEZzep8AZ0xbJ4kLEGLBSUZU3YT95btfMs8OKuRFSQ5TKc3kF4WGKRQgOT5KN3-XthLQ5zYpYVjrDw7oW5sIEKsea-TbUdFVfpj-JLCrh9ouCUlRROblbTo16y0xj69DTOIYcAsEoqOv2ElyeW4XArxSjADWj5DFYEPZG8bXmLqyf6OV3swmwSt4B34TJT1jGYVaTQapIOI4VL41JxuOvClq8RRnICg3-8R0mylNwumvhtqR21Z3jYJtYuZtZMLhwRuw2EsCdlMF5wvCI3ogmeDOFBUbF_-DSRQ-03stj3KHLRkYlzZySMRSzukQrjFyyrtpKAixbe02fotRXgQUUweTDxVcY7P04PdCzp4-gl7BFSjgT28t8h310NNotCNUE1YJSewqtqEL1uCpMoDCfbN_YHy3kWP1RrWV7_jNUPxGqYtZ77V3D_wfcrfkX2sbANj7-heEDrJeSMc3Te18ghRGEUCG1JfK8Rx1nDdrzzP07vCHGTox9DB4xrGPEcTzA6GfyR7Vsew0C24mPR3gFhKj-n2HkgEpdjIZrGhzDzqOGBW335mxh-39hTeBSMxvdWC4G8wvuczbeHlq-1VffpYMR-CfgfW2Kf_y_fIyO-DAC6WdRJe3NAQJ7uuqnvTvKkKG_fgBcnXqJ2RKh0sspOjYtOFoJyG8mDELo3Gt3cbOk","iv":"acbTS1uAJbcdJSUW","protected":"eyJhbGciOiJFQ0RILUVTK0EyNTZLVyIsImVuYyI6IkEyNTZHQ00iLCJzaGFyZWRIZWFkZXIiOnsicGF5bG9hZCI6ImV5SnphR0Z5WlVsa0lqb2lOREkzTlRjeU5qTXRNemhrTmkwME1qY3dMVGxqT1dJdE1HWm1NV1l4WlRjME1XUmtJaXdpYjNkdVpYSWlPaUp5WldObGFYWmxjaUlzSW5KbFkyVnBkbVZ5Y3lJNld5SnlaV05sYVhabGNpSXNJbk5sYm1SbGNpSmRmUSIsInByb3RlY3RlZCI6ImV5SmhiR2NpT2lKRlV6STFOaUo5Iiwic2lnbmF0dXJlIjoicUU4YllDOFI4SzBPbnJndGNKdXNiRFpsZEFoOEVmMVpockNQSEVLRFlyaUUxV2hJQm0tNmRrSlpGdlVzNGoxRzk5eWthTXBZbWpxS3JjTzctcXdMNncifX0","recipients":[{"encrypted_key":"WtIEYRlcGm-f2mvHtVVfd6kvoas8JoCHct588BehjR-pzrxF1WPsjA","header":{"epk":{"crv":"P-256","kty":"EC","x":"uSBaUaWBEFzNzCxIsYSK7wxquCLNbF-mZTJ0A3gefsU","y":"SdIArwd5q5Bpw6wZolAPVwAWXKN3wcm3xNla4hP09rA"}}},{"encrypted_key":"IeLDWoWw970dtDmo1KeKJtHbm90-9e5sd5FhgF6yTFgxrU1uKM2brQ","header":{"epk":{"crv":"P-256","kty":"EC","x":"m7NjzJqYeORHj3ynG39yNgfeCzr2vMJ88uilCynlwSs","y":"eddAA468pyeeShgBj_k5nqMVJiHrnsXu84LUET9brLM"}}}],"tag":"wJ_9nBmqrvHS7-WjCl4Gqg"}';

describe('Test compatibility with go-it-crypto', () => {
  test('Decrypt JWE for single receiver', async () => {
    let sender = await UserManagement.importAuthenticatedUser(
      'sender',
      TestKeys.pubA,
      TestKeys.pubA,
      TestKeys.privA,
      TestKeys.privA
    );

    let receiver = await UserManagement.importAuthenticatedUser(
      'receiver',
      TestKeys.pubB,
      TestKeys.pubB,
      TestKeys.privB,
      TestKeys.privB
    );

    let fetchUser = createFetchSender([sender, receiver]);

    let signedLog = await receiver.decrypt(goDecryptB, fetchUser);
    let accessLog = signedLog.extract();
    expect(accessLog.justification).toBe('go-it-crypto');
  });
  test('Decrypt JWE for multiple receivers', async () => {
    let sender = await UserManagement.importAuthenticatedUser(
      'sender',
      TestKeys.pubA,
      TestKeys.pubA,
      TestKeys.privA,
      TestKeys.privA
    );

    let receiver = await UserManagement.importAuthenticatedUser(
      'receiver',
      TestKeys.pubB,
      TestKeys.pubB,
      TestKeys.privB,
      TestKeys.privB
    );

    let fetchUser = createFetchSender([sender, receiver]);

    let signedLog = await sender.decrypt(goDecryptAB, fetchUser);
    let accessLog = signedLog.extract();
    expect(accessLog.justification).toBe('go-it-crypto');

    signedLog = await receiver.decrypt(goDecryptAB, fetchUser);
    accessLog = signedLog.extract();
    expect(accessLog.justification).toBe('go-it-crypto');
  });
});

describe('Test compatibility with py-it-crypto', () => {
  test('Decrypt JWE for single receiver', async () => {
    let sender = await UserManagement.importAuthenticatedUser(
      'sender',
      TestKeys.pubA,
      TestKeys.pubA,
      TestKeys.privA,
      TestKeys.privA
    );

    let receiver = await UserManagement.importAuthenticatedUser(
      'receiver',
      TestKeys.pubB,
      TestKeys.pubB,
      TestKeys.privB,
      TestKeys.privB
    );

    let fetchUser = createFetchSender([sender, receiver]);

    let signedLog = await receiver.decrypt(pythonDecryptB, fetchUser);
    let accessLog = signedLog.extract();
    expect(accessLog.justification).toBe('py-it-crypto');
  });
  test('Decrypt JWE for multiple receivers', async () => {
    let sender = await UserManagement.importAuthenticatedUser(
      'sender',
      TestKeys.pubA,
      TestKeys.pubA,
      TestKeys.privA,
      TestKeys.privA
    );

    let receiver = await UserManagement.importAuthenticatedUser(
      'receiver',
      TestKeys.pubB,
      TestKeys.pubB,
      TestKeys.privB,
      TestKeys.privB
    );

    let fetchUser = createFetchSender([sender, receiver]);

    let signedLog = await sender.decrypt(pythonDecryptAB, fetchUser);
    let accessLog = signedLog.extract();
    expect(accessLog.justification).toBe('py-it-crypto');

    signedLog = await receiver.decrypt(pythonDecryptAB, fetchUser);
    accessLog = signedLog.extract();
    expect(accessLog.justification).toBe('py-it-crypto');
  });
});
