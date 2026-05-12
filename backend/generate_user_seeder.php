<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = [];
foreach (\App\Models\User::all() as $user) {
    // getAttributes devuelve TODO lo que hay en la tabla, incluyendo password
    $users[] = $user->getAttributes();
}

$seederContent = "<?php\n\nnamespace Database\Seeders;\n\nuse Illuminate\Database\Seeder;\nuse App\Models\User;\nuse Illuminate\Support\Facades\DB;\n\nclass UserSeeder extends Seeder\n{\n    public function run(): void\n    {\n        DB::statement('SET FOREIGN_KEY_CHECKS=0;');\n        User::truncate();\n        DB::statement('SET FOREIGN_KEY_CHECKS=1;');\n\n        \$users = " . var_export($users, true) . ";\n\n        foreach (\$users as \$user) {\n            User::create(\$user);\n        }\n    }\n}\n";

file_put_contents('database/seeders/UserSeeder.php', $seederContent);
echo "UserSeeder.php (RAW) generated successfully!\n";
