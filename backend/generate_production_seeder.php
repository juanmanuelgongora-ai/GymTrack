<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Cliente;

$users = [];
foreach (User::all() as $user) {
    $users[] = $user->getAttributes();
}

$clientes = [];
foreach (Cliente::all() as $cliente) {
    $clientes[] = $cliente->getAttributes();
}

$seederContent = "<?php\n\nnamespace Database\Seeders;\n\nuse Illuminate\Database\Seeder;\nuse App\Models\User;\nuse App\Models\Cliente;\nuse Illuminate\Support\Facades\DB;\n\nclass ProductionDataSeeder extends Seeder\n{\n    public function run(): void\n    {\n        DB::statement('SET FOREIGN_KEY_CHECKS=0;');\n        User::truncate();\n        Cliente::truncate();\n        DB::statement('SET FOREIGN_KEY_CHECKS=1;');\n\n        \$users = " . var_export($users, true) . ";\n        foreach (\$users as \$user) {\n            User::create(\$user);\n        }\n\n        \$clientes = " . var_export($clientes, true) . ";\n        foreach (\$clientes as \$cliente) {\n            Cliente::create(\$cliente);\n        }\n    }\n}\n";

file_put_contents('database/seeders/ProductionDataSeeder.php', $seederContent);
echo "ProductionDataSeeder.php generated successfully!\n";
