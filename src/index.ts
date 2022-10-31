import { DecryptionService } from './crypto/decryption';
import { EncryptionService } from './crypto/encryption';
import { AccessLog } from './logs/accessLog';
import { UserManagement } from './user/user';
import { createFetchSender } from './utils/fetchSender';
import { v4 } from 'uuid';
import { TestKeys } from './__test__/utils';

export { DecryptionService } from './crypto/decryption';
export { EncryptionService } from './crypto/encryption';

export async function test() {
  // Setup Users
  let monitor = await UserManagement.generateAuthenticatedUser();
  let owner = await UserManagement.generateAuthenticatedUser();
  let receiver = await UserManagement.generateAuthenticatedUser();
  let fetchSender = createFetchSender([monitor, owner, receiver]);

  // 1. Step: Monitor creates log and encrypts it for owner
  let signedLog = await monitor.signAccessLog(
    new AccessLog(monitor.id, owner.id, 'tool', 'jus', 30, 'direct', ['email', 'address'])
  );
  let jwe = await monitor.encrypt(signedLog, [owner]);
  console.log(JSON.stringify(jwe));

  // 2. Step: Owner can decrypt log
  let logOut = await owner.decrypt(jwe, fetchSender);
  let accessLog = logOut.extract();
  console.log(accessLog);

  // 3. Step: Owner shares with receivers
  jwe = await owner.encrypt(logOut, [owner, receiver]);

  // 4. Step: Owner and receiver can decrypt
  logOut = await owner.decrypt(jwe, fetchSender);
  logOut = await receiver.decrypt(jwe, fetchSender);
  console.log(logOut.extract());

  // let shouldRaiseError = await decService3.decrypt(jwe);
}

test();
