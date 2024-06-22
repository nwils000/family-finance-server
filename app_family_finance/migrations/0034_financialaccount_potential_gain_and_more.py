# Generated by Django 5.0.6 on 2024-06-21 15:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_family_finance', '0033_alter_family_price_per_difficulty_point'),
    ]

    operations = [
        migrations.AddField(
            model_name='financialaccount',
            name='potential_gain',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='financialaccount',
            name='potential_loss',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
    ]