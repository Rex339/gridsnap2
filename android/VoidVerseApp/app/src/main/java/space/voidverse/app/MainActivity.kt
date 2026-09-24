package space.voidverse.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.AccountCircle
import androidx.compose.material.icons.outlined.Store
import androidx.compose.material.icons.outlined.ViewModule
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import space.voidverse.app.ui.theme.VoidVerseTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            VoidVerseTheme {
                VoidVerseApp()
            }
        }
    }
}

@Composable
fun VoidVerseApp() {
    var selectedTab by remember { mutableStateOf("Discover") }
    var showAuth by remember { mutableStateOf(true) }

    if (showAuth) {
        AuthScreen(onContinue = { showAuth = false })
        return
    }

    Scaffold(
        bottomBar = {
            NavigationBar {
                val tabs = listOf(
                    "Discover" to Icons.Outlined.ViewModule,
                    "Avatar" to Icons.Outlined.AccountCircle,
                    "Shop" to Icons.Outlined.Store,
                    "Profile" to Icons.Outlined.AccountCircle
                )
                tabs.forEach { (label, icon) ->
                    NavigationBarItem(
                        selected = selectedTab == label,
                        onClick = { selectedTab = label },
                        icon = { Icon(icon, contentDescription = label) },
                        label = { Text(label) }
                    )
                }
            }
        }
    ) { padding ->
        when (selectedTab) {
            "Discover" -> DiscoverScreen(modifier = Modifier.padding(padding))
            "Avatar" -> AvatarScreen(modifier = Modifier.padding(padding))
            "Shop" -> ShopScreen(modifier = Modifier.padding(padding))
            else -> ProfileScreen(modifier = Modifier.padding(padding))
        }
    }
}

@Composable
fun AuthScreen(onContinue: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF090B16))
            .padding(20.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("VOIDVERSE", fontSize = 26.sp, fontWeight = FontWeight.ExtraBold, color = Color.White)
        Spacer(modifier = Modifier.height(12.dp))
        Text("Build worlds. Find yours.", color = Color(0xFFB7BCD5))
        Spacer(modifier = Modifier.height(24.dp))
        Card(
            colors = CardDefaults.cardColors(containerColor = Color(0xFF151B2D)),
            shape = RoundedCornerShape(24.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text("Create account", style = MaterialTheme.typography.titleLarge)
                Text("player_name", color = Color(0xFFB7BCD5))
                Text("you@example.com", color = Color(0xFFB7BCD5))
                Text("password", color = Color(0xFFB7BCD5))
                Button(
                    onClick = onContinue,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF8B6BFF)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Enter VoidVerse")
                }
            }
        }
    }
}

@Composable
fun DiscoverScreen(modifier: Modifier = Modifier) {
    val scroll = rememberScrollState()
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF090B16))
            .verticalScroll(scroll)
            .padding(horizontal = 20.dp, vertical = 18.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp)
    ) {
        TopBar()
        HeroCard()
        SectionHeader("Featured worlds")
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            WorldCard("Neon Drift")
            WorldCard("Skyline Rush")
            WorldCard("Crystal Garden")
        }
        SectionHeader("Daily quests")
        QuestCard("Customize your avatar", "+15 TIX")
        QuestCard("Open the portal", "+25 TIX")
        QuestCard("Use an emote", "+10 TIX")
    }
}

@Composable
fun AvatarScreen(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF090B16))
            .padding(horizontal = 20.dp, vertical = 18.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp)
    ) {
        TopBar()
        Card(
            colors = CardDefaults.cardColors(containerColor = Color(0xFF151B2D)),
            shape = RoundedCornerShape(24.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Box(
                    modifier = Modifier
                        .size(180.dp)
                        .background(
                            brush = Brush.linearGradient(listOf(Color(0xFF8B6BFF), Color(0xFF5FD9C4))),
                            shape = RoundedCornerShape(28.dp)
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(90.dp)
                            .clip(CircleShape)
                            .background(Color.White.copy(alpha = 0.18f))
                    )
                }
                Spacer(modifier = Modifier.height(14.dp))
                Text("Nova", style = MaterialTheme.typography.headlineSmall)
                Text("Level 12 • Explorer", color = Color(0xFFB7BCD5))
                Spacer(modifier = Modifier.height(16.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    listOf("Violet", "Cyan", "Pink", "Lime").forEach { _ ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = Color(0xFF1A2136)),
                            shape = RoundedCornerShape(999.dp)
                        ) {
                            Text(
                                text = "Color",
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                                color = Color.White,
                                fontSize = 12.sp
                            )
                        }
                    }
                }
            }
        }
        SectionHeader("Equipped gear")
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            GearChip("Nebula Hood")
            GearChip("Orbit Aura")
            GearChip("Void Wings")
        }
    }
}

@Composable
fun ShopScreen(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF090B16))
            .padding(horizontal = 20.dp, vertical = 18.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp)
    ) {
        TopBar()
        Card(
            colors = CardDefaults.cardColors(containerColor = Color(0xFF151B2D)),
            shape = RoundedCornerShape(24.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Text("Vault", style = MaterialTheme.typography.headlineSmall)
                Spacer(modifier = Modifier.height(8.dp))
                Text("150 TIX   •   0 VV", color = Color(0xFFB7BCD5))
                Spacer(modifier = Modifier.height(14.dp))
                Button(
                    onClick = {},
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF8B6BFF)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Trade 50 TIX → 10 VV")
                }
            }
        }
        SectionHeader("Cosmic shop")
        val catalog = listOf(
            "Nebula Hood" to "8 VV",
            "Orbit Aura" to "12 VV",
            "Void Wings" to "18 VV",
            "Pixel Crown" to "25 VV"
        )
        catalog.forEach { (label, price) ->
            ShopItemRow(label, price)
        }
    }
}

@Composable
fun ProfileScreen(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF090B16))
            .padding(horizontal = 20.dp, vertical = 18.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp)
    ) {
        TopBar()
        Card(
            colors = CardDefaults.cardColors(containerColor = Color(0xFF151B2D)),
            shape = RoundedCornerShape(24.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text("Profile", style = MaterialTheme.typography.headlineSmall)
                Spacer(modifier = Modifier.height(8.dp))
                Text("nova_builder", color = Color(0xFFB7BCD5))
                Text("Creator ranking: Asteroid", color = Color(0xFFB7BCD5))
            }
        }
        SectionHeader("Badges")
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            BadgedPill("✦")
            BadgedPill("⚡")
            BadgedPill("☄")
            BadgedPill("🌀")
        }
    }
}

@Composable
fun TopBar() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .clip(CircleShape)
                    .background(Brush.linearGradient(listOf(Color(0xFF8B6BFF), Color(0xFF5FD9C4)))),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Filled.Star,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(16.dp)
                )
            }
            Spacer(modifier = Modifier.size(10.dp))
            Text("VOIDVERSE", fontWeight = FontWeight.ExtraBold, letterSpacing = 2.sp)
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            WalletPill("150")
            WalletPill("0 VV")
        }
    }
}

@Composable
fun WalletPill(value: String) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color(0xFF1A2136)),
        shape = RoundedCornerShape(999.dp)
    ) {
        Text(
            text = value,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            color = Color.White,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
fun HeroCard() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF11182D)),
        shape = RoundedCornerShape(24.dp)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Text("Good evening, Nova.", style = MaterialTheme.typography.headlineMedium)
            Spacer(modifier = Modifier.height(10.dp))
            Text("The Verse is waiting for your next moment of wonder.", color = Color(0xFFB7BCD5))
            Spacer(modifier = Modifier.height(18.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Button(onClick = {}) { Text("Enter Portal") }
                Button(
                    onClick = {},
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1B2438))
                ) { Text("Photo mode") }
            }
        }
    }
}

@Composable
fun SectionHeader(title: String) {
    Text(text = title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
}

@Composable
fun WorldCard(label: String) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color(0xFF151B2D)),
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier.width(200.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(120.dp)
                .background(
                    brush = Brush.linearGradient(listOf(Color(0xFF7B6CFF), Color(0xFF38D7DF)))
                )
        )
        Column(modifier = Modifier.padding(14.dp)) {
            Text(label)
            Text("Explore and play", color = Color(0xFFB7BCD5), fontSize = 12.sp)
        }
    }
}

@Composable
fun QuestCard(label: String, reward: String) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color(0xFF151B2D)),
        shape = RoundedCornerShape(18.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 14.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(label)
                Text(reward, color = Color(0xFF5FD9C4))
            }
            Button(onClick = {}) { Text("Claim") }
        }
    }
}

@Composable
fun GearChip(label: String) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color(0xFF1A2136)),
        shape = RoundedCornerShape(999.dp)
    ) {
        Text(
            text = label,
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
            color = Color.White
        )
    }
}

@Composable
fun ShopItemRow(label: String, price: String) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color(0xFF151B2D)),
        shape = RoundedCornerShape(16.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(label)
                Text("Limited drop", color = Color(0xFFB7BCD5), fontSize = 12.sp)
            }
            Button(
                onClick = {},
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF8B6BFF))
            ) {
                Text(price)
            }
        }
    }
}

@Composable
fun BadgedPill(icon: String) {
    Box(
        modifier = Modifier
            .size(52.dp)
            .clip(CircleShape)
            .background(Color(0xFF1A2136)),
        contentAlignment = Alignment.Center
    ) {
        Text(icon, fontSize = 22.sp)
    }
}
